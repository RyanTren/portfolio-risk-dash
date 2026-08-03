using System.ComponentModel.DataAnnotations;

namespace backend.backendAPI.DTO.Requests
{
    /// <summary>
    /// Request payload for user registration.
    /// </summary>
    public class RegisterRequest
    {
        /// <summary>Username for the new account.</summary>
        [Required]
        [MaxLength(50)]
        public required string Username { get; set; }

        /// <summary>Email for the new account.</summary>
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        /// <summary>Password for the new account.</summary>
        [Required]
        [MinLength(6)]
        public required string Password { get; set; }

        /// <summary>Role for the new user (default: User).</summary>
        public string Role { get; set; } = "User";
    }
}
