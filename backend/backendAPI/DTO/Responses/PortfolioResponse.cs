namespace backend.backendAPI.DTO.Responses
{
    /// <summary>
    /// Response DTO representing a portfolio with its positions.
    /// </summary>
    public class PortfolioResponse
    {
        /// <summary>Unique portfolio identifier.</summary>
        public int Id { get; set; }

        /// <summary>Portfolio name.</summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>Number of positions in the portfolio.</summary>
        public int PositionCount { get; set; }

        /// <summary>Timestamp when the portfolio was created.</summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>List of positions in this portfolio.</summary>
        public List<PositionResponse> Positions { get; set; } = new();
    }
}
