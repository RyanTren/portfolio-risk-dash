using Microsoft.Extensions.Options;
using backend.backendAPI.Models;
using backend.backendAPI.Data;
using backend.backendAPI.Interfaces;
using backend.backendAPI.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.backendAPI.Services
{
    /// <summary>
    /// Handles risk calculation logic including VaR and stress loss computations.
    /// </summary>
    public class RiskCalculationService : IRiskService
    {
        private readonly AppDbContext _db;
        private readonly RiskCalculationOptions _options;

        /// <summary>
        /// Initializes a new instance of the <see cref="RiskCalculationService"/> class.
        /// </summary>
        /// <param name="db">The application database context.</param>
        /// <param name="options">Risk calculation configuration.</param>
        public RiskCalculationService(AppDbContext db, IOptions<RiskCalculationOptions> options)
        {
            _db = db;
            _options = options.Value;
        }

        /// <inheritdoc/>
        public async Task<int> StartRiskRunAsync(int portfolioId)
        {
            var job = new RiskResult
            {
                PortfolioId = portfolioId,
                Status = RiskResultStatus.Pending,
                Timestamp = DateTime.UtcNow
            };

            _db.RiskResults.Add(job);
            await _db.SaveChangesAsync();

            // TODO: Queue background work (BackgroundService / Hangfire)
            await RunCalculationAsync(job.RiskId);

            return job.RiskId;
        }

        /// <inheritdoc/>
        public async Task<RiskResult?> GetRiskResultAsync(int riskId)
        {
            return await _db.RiskResults.FindAsync(riskId);
        }

        /// <summary>
        /// Executes the risk calculation for a given risk result record.
        /// Computes portfolio value, Value at Risk (VaR), and stress loss.
        /// </summary>
        private async Task RunCalculationAsync(int id)
        {
            var record = await _db.RiskResults.FindAsync(id);

            if (record is null)
                return;

            try
            {
                var positions = await _db.Positions
                    .Where(p => p.PortfolioId == record.PortfolioId)
                    .ToListAsync();

                if (!positions.Any())
                {
                    record.Status = RiskResultStatus.Failed;
                    await _db.SaveChangesAsync();
                    return;
                }

                decimal totalValue = positions.Sum(p => p.Quantity * p.Price);
                decimal var = RiskCalculationHelpers.CalculateVaR(
                    totalValue, _options.Volatility, _options.VarMultiplier);
                decimal stressLoss = RiskCalculationHelpers.CalculateStressLoss(
                    totalValue, _options.StressLossPercent);

                record.PortfolioValue = totalValue;
                record.VaR = var;
                record.StressLoss = stressLoss;
                record.Status = RiskResultStatus.Completed;
            }
            catch
            {
                record.Status = RiskResultStatus.Failed;
            }

            record.Timestamp = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}