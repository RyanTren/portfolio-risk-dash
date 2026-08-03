using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Models;

namespace backend.backendAPI.Data.SeedData
{
    /// <summary>
    /// Seeds the database with initial data for development.
    /// </summary>
    public static class SeedData
    {
        /// <summary>
        /// Initializes the database with a default admin user if no users exist.
        /// </summary>
        /// <param name="serviceProvider">The service provider for resolving DbContext.</param>
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Only seed if the database is empty
            if (await context.Users.AnyAsync())
                return;

            // Create default admin user
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@portfoliodash.com",
                PasswordHash = HashPassword("admin123"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Hashes a password using PBKDF2 with a random salt.
        /// Must match AuthService.HashPassword format.
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
    }
}
