using System;
using System.Collections.Generic;
using backend.backendAPI.Models;
using backend.backendAPI.Data;
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

        public async Task<int> StartRiskRunAsync()
        {
            var result = new RiskResult
            {
                Status = "Running"
            };

            _db.RiskResults.Add(result);
            await _db.SaveChangesAsync();

            _ = Task.Run(() => RunCalculationAsync(result.riskId));

            return result.riskId;
        }

        private async Task RunCalculationAsync(int id)
        {
            var record = await _db.RiskResults.FindAsync(id);

            try
            {
                record.VaR = CalculateVaR();
                record.StressLoss = CalculateStressLost();

                record.Status = "Completed";
            }
            catch
            {
                record.Status = "Failed";
            }

            await _db.SaveChangesAsync();
        }

        private decimal CalculateVaR()
        {
            return Random.Shared.Next(1000, 5000);
        }

        private decimal CalculateStressLost()
        {
            return Random.Shared.Next(2000, 6000);
        }
       
        
    }
}