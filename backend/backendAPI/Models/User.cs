namespace backend.backendAPI.Models
{
    /// <summary>
    /// Represents a user account for authentication.
    /// </summary>
    public class User
    {
        /// <summary>Unique user identifier.</summary>
        public int Id { get; set; }

        /// <summary>Unique username for login.</summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>User's email address.</summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>Hashed password (empty for OAuth-only users).</summary>
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>User's role for claims-based authorization.</summary>
        public string Role { get; set; } = "User";

        /// <summary>Google OAuth subject ID (if linked).</summary>
        public string? GoogleId { get; set; }

        /// <summary>Profile display name.</summary>
        public string? DisplayName { get; set; }

        /// <summary>Timestamp when the user was created.</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Timestamp when the user was last updated.</summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
