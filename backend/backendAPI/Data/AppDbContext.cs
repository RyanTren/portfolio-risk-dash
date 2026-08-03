using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Models;

namespace backend.backendAPI.Data
{
    /// <summary>
    /// Application database context for Entity Framework Core.
    /// </summary>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AppDbContext"/> class.
        /// </summary>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        /// <summary>Portfolios table.</summary>
        public DbSet<Portfolio> Portfolios { get; set; } = null!;

        /// <summary>Positions table.</summary>
        public DbSet<Position> Positions { get; set; } = null!;

        /// <summary>Risk results table.</summary>
        public DbSet<RiskResult> RiskResults { get; set; } = null!;

        /// <summary>Users table for authentication.</summary>
        public DbSet<User> Users { get; set; } = null!;

        /// <summary>Refresh tokens table for session management.</summary>
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

        /// <summary>
        /// Applies Fluent API configurations from the assembly.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}