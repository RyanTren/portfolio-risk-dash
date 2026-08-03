namespace backend.backendAPI.DTO.Responses
{
    /// <summary>
    /// Response returned after successful authentication.
    /// </summary>
    public class AuthResponse
    {
        /// <summary>JWT access token.</summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>Token expiration time in seconds.</summary>
        public int ExpiresIn { get; set; }

        /// <summary>Authenticated user's username.</summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>Authenticated user's email.</summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>Authenticated user's role.</summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>Authenticated user's ID.</summary>
        public int UserId { get; set; }

        /// <summary>Refresh token (returned in response body for client-side storage if needed).</summary>
        public string? RefreshToken { get; set; }
    }

    /// <summary>
    /// User profile response DTO.
    /// </summary>
    public class UserProfileResponse
    {
        /// <summary>User ID.</summary>
        public int Id { get; set; }

        /// <summary>Username.</summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>Email address.</summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>Display name.</summary>
        public string? DisplayName { get; set; }

        /// <summary>User role.</summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>Whether the account is linked to Google.</summary>
        public bool HasGoogleLinked { get; set; }

        /// <summary>Account creation date.</summary>
        public DateTime CreatedAt { get; set; }
    }
}
