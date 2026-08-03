using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Models;
using backend.backendAPI.Interfaces;
using backend.backendAPI.DTO.Responses;
using System.Globalization;

namespace backend.backendAPI.Services
{
    /// <summary>
    /// Handles portfolio CRUD operations and CSV import.
    /// </summary>
    public class PortfolioService : IPortfolioService
    {
        private readonly AppDbContext _db;

        /// <summary>
        /// Initializes a new instance of the <see cref="PortfolioService"/> class.
        /// </summary>
        public PortfolioService(AppDbContext db)
        {
            _db = db;
        }

        /// <inheritdoc/>
        public async Task<Portfolio> CreateFromCsvAsync(string portfolioName, Stream csvStream)
        {
            using var reader = new StreamReader(csvStream);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

            var records = csv.GetRecords<PositionCsvModel>().ToList();

            var portfolio = new Portfolio
            {
                Name = portfolioName,
                Positions = new List<Position>()
            };

            foreach (var r in records)
            {
                if (string.IsNullOrWhiteSpace(r.Ticker))
                    throw new Exception("CSV row missing Ticker");

                portfolio.Positions.Add(new Position
                {
                    Ticker = r.Ticker,
                    Quantity = r.Quantity,
                    Price = r.Price
                });
            }

            _db.Portfolios.Add(portfolio);
            await _db.SaveChangesAsync();

            return portfolio;
        }

        /// <inheritdoc/>
        public async Task<List<Portfolio>> GetPortfoliosAsync() =>
            await _db.Portfolios.Include(p => p.Positions).ToListAsync();

        /// <inheritdoc/>
        public async Task<Portfolio?> GetPortfolioAsync(int id) =>
            await _db.Portfolios.Include(p => p.Positions).FirstOrDefaultAsync(p => p.Id == id);

        /// <inheritdoc/>
        public async Task<bool> DeletePortfolioAsync(int id)
        {
            var portfolio = await _db.Portfolios.FindAsync(id);
            if (portfolio is null) return false;

            _db.Portfolios.Remove(portfolio);
            await _db.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Maps a Portfolio entity to a PortfolioResponse DTO.
        /// Used by the controller for consistent responses.
        /// </summary>
        public static PortfolioResponse MapToResponse(Portfolio p)
        {
            return new PortfolioResponse
            {
                Id = p.Id,
                Name = p.Name,
                PositionCount = p.Positions.Count,
                CreatedAt = p.CreatedAt,
                Positions = p.Positions.Select(pos => new PositionResponse
                {
                    Id = pos.Id,
                    PortfolioId = pos.PortfolioId,
                    Ticker = pos.Ticker,
                    Quantity = pos.Quantity,
                    Price = pos.Price
                }).ToList()
            };
        }

        private class PositionCsvModel
        {
            public required string Ticker { get; set; }
            public decimal Quantity { get; set; }
            public decimal Price { get; set; }
        }
    }
}