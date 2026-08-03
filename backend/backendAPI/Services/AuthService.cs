using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using backend.backendAPI.Data;
using backend.backendAPI.DTO.Requests;
using backend.backendAPI.DTO.Responses;
using backend.backendAPI.Helpers;
using backend.backendAPI.Interfaces;
using backend.backendAPI.Models;

namespace backend.backendAPI.Services
{
    /// <summary>
    /// Handles user authentication and JWT token generation.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly JwtOptions _jwtOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthService"/> class.
        /// </summary>
        public AuthService(AppDbContext db, IOptions<JwtOptions> jwtOptions)
        {
            _db = db;
            _jwtOptions = jwtOptions.Value;
        }

        /// <inheritdoc/>
        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user is null || string.IsNullOrEmpty(user.PasswordHash) || !VerifyPassword(request.Password, user.PasswordHash))
                return null;

            var token = GenerateJwtToken(user);
            var expiresInSeconds = (int)(_jwtOptions.ExpirationMinutes * 60);

            return new AuthResponse
            {
                Token = token,
                ExpiresIn = expiresInSeconds,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                UserId = user.Id
            };
        }

        /// <inheritdoc/>
        public async Task<User?> RegisterAsync(RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
                return null;

            if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                return null;

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                Role = request.Role
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return user;
        }

        /// <inheritdoc/>
        public async Task<RefreshToken> GenerateRefreshTokenAsync(int userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = GenerateRandomToken(),
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtOptions.RefreshExpirationDays),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            return refreshToken;
        }

        /// <inheritdoc/>
        public async Task<AuthResponse?> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _db.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken is null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTime.UtcNow)
                return null;

            // Revoke the old refresh token (rotation)
            storedToken.IsRevoked = true;
            await _db.SaveChangesAsync();

            // Generate new token pair
            var newAccessToken = GenerateJwtToken(storedToken.User!);
            var newRefreshToken = await GenerateRefreshTokenAsync(storedToken.UserId);
            var expiresInSeconds = (int)(_jwtOptions.ExpirationMinutes * 60);

            return new AuthResponse
            {
                Token = newAccessToken,
                ExpiresIn = expiresInSeconds,
                Username = storedToken.User!.Username,
                Email = storedToken.User.Email,
                Role = storedToken.User.Role,
                UserId = storedToken.User.Id,
                RefreshToken = newRefreshToken.Token
            };
        }

        /// <inheritdoc/>
        public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _db.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken is null)
                return false;

            storedToken.IsRevoked = true;
            await _db.SaveChangesAsync();
            return true;
        }

        /// <inheritdoc/>
        public async Task<bool> ValidateRefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _db.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            return storedToken is not null 
                && !storedToken.IsRevoked 
                && storedToken.ExpiresAt >= DateTime.UtcNow;
        }

        /// <inheritdoc/>
        public async Task<UserProfileResponse?> GetProfileAsync(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user is null)
                return null;

            return new UserProfileResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Role = user.Role,
                HasGoogleLinked = !string.IsNullOrEmpty(user.GoogleId),
                CreatedAt = user.CreatedAt
            };
        }

        /// <inheritdoc/>
        public async Task<UserProfileResponse?> UpdateProfileAsync(int userId, UpdateProfileRequest request)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user is null)
                return null;

            // Check if email is already taken by another user
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                if (await _db.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId))
                    return null; // Email already taken
            }

            if (request.DisplayName is not null)
                user.DisplayName = request.DisplayName;

            if (request.Email is not null)
                user.Email = request.Email;

            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return new UserProfileResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Role = user.Role,
                HasGoogleLinked = !string.IsNullOrEmpty(user.GoogleId),
                CreatedAt = user.CreatedAt
            };
        }

        /// <inheritdoc/>
        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user is null)
                return false;

            // OAuth-only users don't have a password
            if (string.IsNullOrEmpty(user.PasswordHash))
                return false;

            if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
                return false;

            user.PasswordHash = HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return true;
        }

        /// <inheritdoc/>
        public async Task<AuthResponse?> GoogleLoginAsync(string googleId, string email, string name)
        {
            // Check if user already linked to this Google account
            var user = await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

            if (user is null)
            {
                // Check if user exists with this email
                user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user is not null)
                {
                    // Link Google account to existing user
                    user.GoogleId = googleId;
                    user.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    // Create new user
                    user = new User
                    {
                        Username = email.Split('@')[0],
                        Email = email,
                        GoogleId = googleId,
                        DisplayName = name,
                        PasswordHash = "", // No password for OAuth users
                        Role = "User"
                    };

                    // Ensure username is unique
                    var baseUsername = user.Username;
                    var counter = 1;
                    while (await _db.Users.AnyAsync(u => u.Username == user.Username))
                    {
                        user.Username = $"{baseUsername}{counter}";
                        counter++;
                    }

                    _db.Users.Add(user);
                }
            }

            await _db.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var expiresInSeconds = (int)(_jwtOptions.ExpirationMinutes * 60);

            return new AuthResponse
            {
                Token = token,
                ExpiresIn = expiresInSeconds,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                UserId = user.Id
            };
        }

        /// <summary>
        /// Generates a JWT token for the specified user.
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtOptions.ExpirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Generates a cryptographically secure random token for refresh tokens.
        /// </summary>
        private static string GenerateRandomToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        /// <summary>
        /// Hashes a password using PBKDF2 with a random salt.
        /// Returns format: base64(salt):base64(hash).
        /// </summary>
        private static string HashPassword(string password)
        {
            var salt = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password, salt, 100_000, HashAlgorithmName.SHA256, 32);

            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
        }

        /// <summary>
        /// Verifies a password against a stored salt:hash.
        /// </summary>
        private static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2)
                return false;

            var salt = Convert.FromBase64String(parts[0]);
            var expectedHash = Convert.FromBase64String(parts[1]);

            var computedHash = Rfc2898DeriveBytes.Pbkdf2(
                password, salt, 100_000, HashAlgorithmName.SHA256, 32);

            return computedHash.SequenceEqual(expectedHash);
        }
    }
}
