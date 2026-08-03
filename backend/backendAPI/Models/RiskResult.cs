namespace backend.backendAPI.Models
{
    /// <summary>
    /// Represents the result of a portfolio risk calculation.
    /// </summary>
    public class RiskResult
    {
        /// <summary>Unique identifier for this risk result.</summary>
        public int RiskId { get; set; }

        /// <summary>ID of the portfolio this result belongs to.</summary>
        public int PortfolioId { get; set; }

        /// <summary>Reference to the parent portfolio (navigation property).</summary>
        public Portfolio? Portfolio { get; set; }

        /// <summary>Timestamp when the calculation was performed.</summary>
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        /// <summary>Total value of the portfolio at calculation time.</summary>
        public decimal? PortfolioValue { get; set; }

        /// <summary>Value at Risk (VaR) at 95% confidence.</summary>
        public decimal? VaR { get; set; }

        /// <summary>Projected loss under a 5% stress scenario.</summary>
        public decimal? StressLoss { get; set; }

        /// <summary>Current status of the calculation.</summary>
        public RiskResultStatus Status { get; set; } = RiskResultStatus.Pending;
    }
}