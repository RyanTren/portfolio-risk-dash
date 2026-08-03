using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.backendAPI.Models;

namespace backend.backendAPI.Data.Configurations
{
    /// <summary>
    /// Fluent API configuration for the Portfolio entity.
    /// </summary>
    public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
    {
        /// <inheritdoc/>
        public void Configure(EntityTypeBuilder<Portfolio> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // Portfolio has many Positions → cascade delete
            builder.HasMany(e => e.Positions)
                .WithOne(p => p.Portfolio)
                .HasForeignKey(p => p.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);

            // Portfolio has many RiskResults → cascade delete
            builder.HasMany(e => e.RiskResults)
                .WithOne(r => r.Portfolio)
                .HasForeignKey(r => r.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(e => e.Name);
        }
    }
}
