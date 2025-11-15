using System;
using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Models;


namespace backend.backendAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<Portfolio> Portfolios {get; set;} = null!;
        public DbSet<Position> Positions {get; set;} = null!;
    }
}