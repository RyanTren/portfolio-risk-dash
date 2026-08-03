using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.backendAPI.Models;

namespace backend.backendAPI.Data.Configurations
{
    /// <summary>
    /// Fluent API configuration for the Position entity.
    /// </summary>
    public class PositionConfiguration : IEntityTypeConfiguration<Position>
    {
        /// <inheritdoc/>
        public void Configure(EntityTypeBuilder<Position> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Ticker)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(e => e.Quantity)
                .HasPrecision(18, 6);

            builder.Property(e => e.Price)
                .HasPrecision(18, 6);

            builder.HasIndex(e => e.PortfolioId);
        }
    }
}
