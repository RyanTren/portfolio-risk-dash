using System.ComponentModel.DataAnnotations;

namespace backend.backendAPI.DTO.Requests
{
    /// <summary>
    /// Request payload for updating user profile.
    /// </summary>
    public class UpdateProfileRequest
    {
        /// <summary>Updated display name.</summary>
        [MaxLength(100)]
        public string? DisplayName { get; set; }

        /// <summary>Updated email address.</summary>
        [EmailAddress]
        public string? Email { get; set; }
    }

    /// <summary>
    /// Request payload for changing password.
    /// </summary>
    public class ChangePasswordRequest
    {
        /// <summary>Current password for verification.</summary>
        [Required]
        public required string CurrentPassword { get; set; }

        /// <summary>New password.</summary>
        [Required]
        [MinLength(6)]
        public required string NewPassword { get; set; }
    }

    /// <summary>
    /// Request payload for Google OAuth login.
    /// </summary>
    public class GoogleLoginRequest
    {
        /// <summary>Google OAuth ID token or authorization code.</summary>
        [Required]
        public required string Credential { get; set; }
    }
}
