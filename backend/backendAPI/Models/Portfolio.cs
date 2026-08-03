namespace backend.backendAPI.Models
{
    /// <summary>
    /// Represents a portfolio containing multiple positions.
    /// </summary>
    public class Portfolio
    {
        /// <summary>Unique portfolio identifier.</summary>
        public int Id { get; set; }

        /// <summary>Portfolio name.</summary>
        public string Name { get; set; } = "";

        /// <summary>Timestamp when the portfolio was created.</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Collection of positions in this portfolio.</summary>
        public IList<Position> Positions { get; set; } = new List<Position>();

        /// <summary>Risk calculation results for this portfolio.</summary>
        public IList<RiskResult> RiskResults { get; set; } = new List<RiskResult>();
    }
}