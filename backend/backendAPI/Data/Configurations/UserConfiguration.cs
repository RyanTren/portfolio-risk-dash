using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.backendAPI.Models;

namespace backend.backendAPI.Data.Configurations
{
    /// <summary>
    /// Fluent API configuration for the User entity.
    /// </summary>
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        /// <inheritdoc/>
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.PasswordHash)
                .IsRequired();

            builder.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(e => e.Username)
                .IsUnique();

            builder.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");
        }
    }
}
