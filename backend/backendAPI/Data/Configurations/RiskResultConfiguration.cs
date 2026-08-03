using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.backendAPI.Models;

namespace backend.backendAPI.Data.Configurations
{
    /// <summary>
    /// Fluent API configuration for the RiskResult entity.
    /// </summary>
    public class RiskResultConfiguration : IEntityTypeConfiguration<RiskResult>
    {
        /// <inheritdoc/>
        public void Configure(EntityTypeBuilder<RiskResult> builder)
        {
            builder.HasKey(e => e.RiskId);

            builder.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            builder.Property(e => e.PortfolioValue)
                .HasPrecision(18, 6);

            builder.Property(e => e.VaR)
                .HasPrecision(18, 6);

            builder.Property(e => e.StressLoss)
                .HasPrecision(18, 6);

            builder.Property(e => e.Timestamp)
                .HasDefaultValueSql("NOW()");

            builder.HasIndex(e => e.PortfolioId);
            builder.HasIndex(e => e.Status);
        }
    }
}
