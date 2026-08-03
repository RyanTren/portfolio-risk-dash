using System.ComponentModel.DataAnnotations;

namespace backend.backendAPI.Models
{
    /// <summary>
    /// Represents a refresh token for extending user sessions.
    /// </summary>
    public class RefreshToken
    {
        /// <summary>Unique refresh token identifier.</summary>
        public int Id { get; set; }

        /// <summary>The refresh token value (stored as hash).</summary>
        [Required]
        public string Token { get; set; } = string.Empty;

        /// <summary>ID of the user this token belongs to.</summary>
        public int UserId { get; set; }

        /// <summary>Navigation property to the user.</summary>
        public User? User { get; set; }

        /// <summary>When the token expires.</summary>
        public DateTime ExpiresAt { get; set; }

        /// <summary>When the token was created.</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Whether the token has been revoked (e.g., on logout).</summary>
        public bool IsRevoked { get; set; } = false;
    }
}
