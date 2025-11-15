using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Models;
using backend.backendAPI.Interfaces;
using System.Globalization;

namespace backend.backendAPI.Services
{
    public class PortfolioService:IPortfolioService
    {
        private readonly AppDbContext _db;

        public PortfolioService(AppDbContext db) {_db = db;}

        public async Task<PortfolioService> CreateFromCsvAsync(string portfolioName, Stream csvStream)
        {
            using var reader = new StreamReader(csvStream);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);


            var records = csv.GetRecords<PositionCsvModel>().ToList();

            var portfolio = new PortfolioService {Name = portfolioName};
            foreach (var r in records)
            {
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
        public async Task<List<Portfolio>> GetPortfoliosAsync(int Id) => await _db.Portfolios.Include(p => p.Positions).FirstOrDefaultAsync(p => p.Id == id);

        private class PositionCsvModel
        {
            public string Ticker {get; set;}
            public decimal Quantity {get; set;}
            public decimal Price {get; set;}

        }
    }
}