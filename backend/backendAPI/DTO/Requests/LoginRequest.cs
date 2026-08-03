using System.ComponentModel.DataAnnotations;

namespace backend.backendAPI.DTO.Requests
{
    /// <summary>
    /// Request payload for user login.
    /// </summary>
    public class LoginRequest
    {
        /// <summary>Username for authentication.</summary>
        [Required]
        public required string Username { get; set; }

        /// <summary>Password for authentication.</summary>
        [Required]
        public required string Password { get; set; }
    }
}
