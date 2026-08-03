namespace backend.backendAPI.Helpers
{
    /// <summary>
    /// Configuration options for JWT authentication.
    /// </summary>
    public class JwtOptions
    {
        /// <summary>Section name in appsettings.json.</summary>
        public const string SectionName = "Jwt";

        /// <summary>Secret key used to sign tokens (min 32 characters).</summary>
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>Issuer of the JWT token.</summary>
        public string Issuer { get; set; } = string.Empty;

        /// <summary>Audience the token is intended for.</summary>
        public string Audience { get; set; } = string.Empty;

        /// <summary>Access token expiration time in minutes.</summary>
        public int ExpirationMinutes { get; set; } = 15;

        /// <summary>Refresh token expiration time in days.</summary>
        public int RefreshExpirationDays { get; set; } = 7;
    }
}
