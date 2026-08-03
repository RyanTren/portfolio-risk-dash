using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using backend.backendAPI.Interfaces;
using backend.backendAPI.DTO.Requests;
using backend.backendAPI.DTO.Responses;

namespace backend.backendAPI.Controllers
{
    /// <summary>
    /// API endpoints for user authentication and registration.
    /// Uses httpOnly cookies for secure token storage.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;
        private readonly bool _isDevelopment;

        private const string AccessTokenCookieName = "AccessToken";
        private const string RefreshTokenCookieName = "RefreshToken";

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        public AuthController(IAuthService authService, IConfiguration configuration, IWebHostEnvironment env)
        {
            _authService = authService;
            _configuration = configuration;
            _isDevelopment = env.IsDevelopment();
        }

        /// <summary>
        /// Authenticates a user and sets httpOnly cookies for access and refresh tokens.
        /// Rate limited to 10 requests per minute.
        /// </summary>
        [HttpPost("login")]
        [EnableRateLimiting("authLimiter")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (result is null)
                return Unauthorized("Invalid username or password.");

            // Generate refresh token
            var refreshToken = await _authService.GenerateRefreshTokenAsync(result.UserId);

            // Set httpOnly cookies
            SetAccessTokenCookie(result.Token, result.ExpiresIn);
            SetRefreshCookie(refreshToken.Token, refreshToken.ExpiresAt);

            // Return user info (not tokens) in response body
            return Ok(new
            {
                result.Username,
                result.Email,
                result.Role,
                result.UserId
            });
        }

        /// <summary>
        /// Registers a new user account.
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(201)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _authService.RegisterAsync(request);
            if (user is null)
                return Conflict("Username or email already exists.");

            return StatusCode(201);
        }

        /// <summary>
        /// Authenticates a user via Google OAuth.
        /// Creates a new account if one doesn't exist for this Google ID.
        /// </summary>
        [HttpPost("google")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                // In production, validate the Google token server-side using Google's API.
                // For now, we decode the JWT token payload (base64) to get user info.
                // IMPORTANT: In production, use Google.Apis.Auth to verify the token properly.
                var payload = DecodeGooglePayload(request.Credential);
                if (payload is null)
                    return Unauthorized("Invalid Google token.");

                var result = await _authService.GoogleLoginAsync(
                    payload.GoogleId,
                    payload.Email,
                    payload.Name);

                if (result is null)
                    return Unauthorized("Google authentication failed.");

                // Generate refresh token
                var refreshToken = await _authService.GenerateRefreshTokenAsync(result.UserId);

                // Set httpOnly cookies
                SetAccessTokenCookie(result.Token, result.ExpiresIn);
                SetRefreshCookie(refreshToken.Token, refreshToken.ExpiresAt);

                return Ok(new
                {
                    result.Username,
                    result.Email,
                    result.Role,
                    result.UserId
                });
            }
            catch (Exception)
            {
                return Unauthorized("Invalid Google token.");
            }
        }

        /// <summary>
        /// Refreshes the access token using the refresh token cookie.
        /// Issues new access and refresh tokens (rotation).
        /// </summary>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Refresh()
        {
            // Get refresh token from cookie
            var refreshToken = Request.Cookies[RefreshTokenCookieName];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("No refresh token provided.");

            var result = await _authService.RefreshTokenAsync(refreshToken);
            if (result is null)
                return Unauthorized("Invalid or expired refresh token.");

            // Set new httpOnly cookies
            SetAccessTokenCookie(result.Token, result.ExpiresIn);
            SetRefreshCookie(result.RefreshToken!, 
                DateTime.UtcNow.AddDays(7)); // RefreshExpirationDays from config

            // Return user info
            return Ok(new
            {
                result.Username,
                result.Email,
                result.Role,
                result.UserId
            });
        }

        /// <summary>
        /// Logs out the user by revoking the refresh token and clearing cookies.
        /// </summary>
        [HttpPost("logout")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies[RefreshTokenCookieName];
            
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _authService.RevokeRefreshTokenAsync(refreshToken);
            }

            // Clear cookies
            Response.Cookies.Delete(AccessTokenCookieName);
            Response.Cookies.Delete(RefreshTokenCookieName);

            return Ok(new { message = "Logged out successfully." });
        }

        /// <summary>
        /// Returns the current user's info based on the access token cookie.
        /// Used by the frontend to check if the user is authenticated.
        /// </summary>
        [HttpGet("me")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(401)]
        public IActionResult Me()
        {
            // If we reach here, the JWT middleware has already validated the token
            // and populated HttpContext.User
            var username = User.Identity?.Name;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            return Ok(new
            {
                Username = username,
                Email = email,
                Role = role,
                UserId = userId != null ? int.Parse(userId) : (int?)null
            });
        }

        /// <summary>
        /// Gets the current user's profile.
        /// </summary>
        [HttpGet("profile")]
        [ProducesResponseType(typeof(UserProfileResponse), 200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized();

            var profile = await _authService.GetProfileAsync(userId.Value);
            if (profile is null)
                return NotFound();

            return Ok(profile);
        }

        /// <summary>
        /// Updates the current user's profile.
        /// </summary>
        [HttpPut("profile")]
        [ProducesResponseType(typeof(UserProfileResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized();

            var profile = await _authService.UpdateProfileAsync(userId.Value, request);
            if (profile is null)
                return BadRequest("Email already taken or user not found.");

            return Ok(profile);
        }

        /// <summary>
        /// Changes the current user's password.
        /// </summary>
        [HttpPost("change-password")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized();

            var success = await _authService.ChangePasswordAsync(userId.Value, request);
            if (!success)
                return BadRequest("Current password is incorrect or account uses OAuth login.");

            return Ok(new { message = "Password changed successfully." });
        }

        /// <summary>
        /// Gets the Google Client ID for the frontend to use.
        /// </summary>
        [HttpGet("google-client-id")]
        [ProducesResponseType(typeof(object), 200)]
        public IActionResult GetGoogleClientId()
        {
            var clientId = _configuration["GoogleAuth:ClientId"] ?? "";
            return Ok(new { clientId });
        }

        /// <summary>
        /// Sets the access token as an httpOnly cookie.
        /// </summary>
        private void SetAccessTokenCookie(string token, int expiresInSeconds)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !_isDevelopment, // Secure=true requires HTTPS; allow HTTP in dev
                SameSite = SameSiteMode.Lax,
                Path = "/",
                MaxAge = TimeSpan.FromSeconds(expiresInSeconds)
            };

            Response.Cookies.Append(AccessTokenCookieName, token, cookieOptions);
        }

        /// <summary>
        /// Sets the refresh token as an httpOnly cookie.
        /// </summary>
        private void SetRefreshCookie(string token, DateTime expiresAt)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !_isDevelopment, // Secure=true requires HTTPS; allow HTTP in dev
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = expiresAt,
                MaxAge = expiresAt - DateTime.UtcNow
            };

            Response.Cookies.Append(RefreshTokenCookieName, token, cookieOptions);
        }

        /// <summary>
        /// Gets the current user's ID from JWT claims.
        /// </summary>
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim is null || !int.TryParse(userIdClaim, out var userId))
                return null;
            return userId;
        }

        /// <summary>
        /// Decodes a Google JWT payload (base64).
        /// NOTE: In production, use Google.Apis.Auth.GoogleJsonWebSignature to validate properly.
        /// </summary>
        private static GooglePayload? DecodeGooglePayload(string credential)
        {
            try
            {
                // Split the JWT token
                var parts = credential.Split('.');
                if (parts.Length != 3)
                    return null;

                // Decode the payload (second part)
                var payload = parts[1];
                // Add padding if needed
                payload = payload.Replace('-', '+').Replace('_', '/');
                switch (payload.Length % 4)
                {
                    case 2: payload += "=="; break;
                    case 3: payload += "="; break;
                }

                var bytes = Convert.FromBase64String(payload);
                var json = Encoding.UTF8.GetString(bytes);

                // Simple JSON parsing without System.Text.Json dependency issues
                var googleId = ExtractJsonValue(json, "sub");
                var email = ExtractJsonValue(json, "email");
                var name = ExtractJsonValue(json, "name");

                if (string.IsNullOrEmpty(googleId) || string.IsNullOrEmpty(email))
                    return null;

                return new GooglePayload
                {
                    GoogleId = googleId,
                    Email = email,
                    Name = name ?? email.Split('@')[0]
                };
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Simple JSON string value extractor.
        /// </summary>
        private static string? ExtractJsonValue(string json, string key)
        {
            var searchKey = $"\"{key}\":";
            var startIndex = json.IndexOf(searchKey, StringComparison.Ordinal);
            if (startIndex == -1)
                return null;

            startIndex += searchKey.Length;
            // Skip whitespace
            while (startIndex < json.Length && json[startIndex] == ' ')
                startIndex++;

            if (startIndex >= json.Length)
                return null;

            if (json[startIndex] == '"')
            {
                // String value
                startIndex++;
                var endIndex = startIndex;
                while (endIndex < json.Length && json[endIndex] != '"')
                {
                    if (json[endIndex] == '\\')
                        endIndex++; // Skip escaped character
                    endIndex++;
                }
                return json.Substring(startIndex, endIndex - startIndex);
            }

            return null;
        }

        private class GooglePayload
        {
            public string GoogleId { get; set; } = "";
            public string Email { get; set; } = "";
            public string Name { get; set; } = "";
        }
    }
}
