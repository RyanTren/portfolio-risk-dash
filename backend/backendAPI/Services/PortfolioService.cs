using CsvHelper;
using CsvHelper.Configuration;

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

using backend.backendAPI.Data;
using backend.backendAPI.Models;
using backend.backendAPI.Interfaces;
using System.Globalization;

namespace backend.backendAPI.Services
{
    public class PortfolioService : IPortfolioService
    {
        private readonly AppDbContext _db;

        public PortfolioService(AppDbContext db) {_db = db;}

        public async Task<Portfolio> CreateFromCsvAsync(string portfolioName, Stream csvStream)
        {
            using var reader = new StreamReader(csvStream);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);


            var records = csv.GetRecords<PositionCsvModel>().ToList();

            var portfolio = new Portfolio {
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
                    }
                );
            }

            _db.Portfolios.Add(portfolio);
            await _db.SaveChangesAsync();

            return portfolio;
        }

        public async Task<List<Portfolio>> GetPortfoliosAsync() => await _db.Portfolios.Include(p => p.Positions).ToListAsync();
        public async Task<Portfolio?> GetPortfolioAsync(int id) => await _db.Portfolios.Include(p => p.Positions).FirstOrDefaultAsync(p => p.Id == id);

        public async Task<bool> DeletePortfolioAsync(int id)
        {
            var portfolio = await _db.Portfolios.FindAsync(id);
            if(portfolio == null) return false;

            _db.Portfolios.Remove(portfolio);
            await _db.SaveChangesAsync();
            return true;
        }

        private class PositionCsvModel
        {
            public required string Ticker {get; set;}
            public decimal Quantity {get; set;}
            public decimal Price {get; set;}

        }
    }
}