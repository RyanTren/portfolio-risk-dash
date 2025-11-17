using System;
using System.Collections.Generic;
using backend.backendAPI.Models;
using backend.backendAPI.Data;
using backend.backendAPI.Models.Requests;
using Microsoft.EntityFrameworkCore;


namespace backend.backendAPI.Services
{
    public class RiskCalculationService
    {
        private readonly AppDbContext _db;
        public RiskCalculationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<int> StartRiskRunAsync(int portfolioId)
        {
            var job = new RiskResult
            {
                PortfolioId = portfolioId,
                Status = "Pending",
                Timestamp = DateTime.UtcNow
            };

            _db.RiskResults.Add(job);
            await _db.SaveChangesAsync();

            // 2. Queue background work (future)
            // BackgroundService / Hangfire task to compute risk later
            
            _ = Task.Run(() => RunCalculationAsync(job.riskId));
            return job.riskId;
        }

        private async Task RunCalculationAsync(int id)
        {
            var record = await _db.RiskResults.FindAsync(id);

            try
            {
                // 1. load positions
            var positions = await _db.Positions
                .Where(p => p.PortfolioId == record.PortfolioId)
                .ToListAsync();

            if (!positions.Any())
            {
                record.Status = "Failed";
                await _db.SaveChangesAsync();
                return;
            }

            // 2. portfolio value
            decimal totalValue = positions.Sum(p => p.Quantity * p.Price);

            // 3. volatility assumption (simple)
            double volatility = 0.02; // 2%

            // 4. VaR
            decimal VaR = totalValue * (decimal)(1.65 * volatility);

            // 5. Stress loss (-5%)
            decimal stressLoss = totalValue * 0.05m;

            record.PortfolioValue = totalValue;
            record.VaR = VaR;
            record.StressLoss = stressLoss;
            record.Status = "Completed";
        }
        catch
        {
            record.Status = "Failed";
        }
            record.Timestamp = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}