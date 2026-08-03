using backend.backendAPI.DTO.Requests;
using backend.backendAPI.DTO.Responses;
using backend.backendAPI.Models;

namespace backend.backendAPI.Interfaces
{
    /// <summary>
    /// Service for user authentication and JWT token generation.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        Task<AuthResponse?> LoginAsync(LoginRequest request);

        /// <summary>
        /// Registers a new user account.
        /// </summary>
        Task<User?> RegisterAsync(RegisterRequest request);

        /// <summary>
        /// Generates a new refresh token for a user.
        /// </summary>
        Task<RefreshToken> GenerateRefreshTokenAsync(int userId);

        /// <summary>
        /// Refreshes an existing refresh token and issues new token pair.
        /// </summary>
        Task<AuthResponse?> RefreshTokenAsync(string refreshToken);

        /// <summary>
        /// Revokes a refresh token (e.g., on logout).
        /// </summary>
        Task<bool> RevokeRefreshTokenAsync(string refreshToken);

        /// <summary>
        /// Validates a refresh token without consuming it.
        /// </summary>
        Task<bool> ValidateRefreshTokenAsync(string refreshToken);

        /// <summary>
        /// Gets a user's profile by ID.
        /// </summary>
        Task<UserProfileResponse?> GetProfileAsync(int userId);

        /// <summary>
        /// Updates a user's profile.
        /// </summary>
        Task<UserProfileResponse?> UpdateProfileAsync(int userId, UpdateProfileRequest request);

        /// <summary>
        /// Changes a user's password.
        /// </summary>
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request);

        /// <summary>
        /// Finds or creates a user from Google OAuth claims.
        /// </summary>
        Task<AuthResponse?> GoogleLoginAsync(string googleId, string email, string name);
    }
}
