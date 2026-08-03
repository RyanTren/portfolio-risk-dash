namespace backend.backendAPI.DTO.Responses
{
    /// <summary>
    /// Response DTO representing a single position within a portfolio.
    /// </summary>
    public class PositionResponse
    {
        /// <summary>Unique position identifier.</summary>
        public int Id { get; set; }

        /// <summary>ID of the parent portfolio.</summary>
        public int PortfolioId { get; set; }

        /// <summary>Stock ticker symbol.</summary>
        public string Ticker { get; set; } = string.Empty;

        /// <summary>Number of shares held.</summary>
        public decimal Quantity { get; set; }

        /// <summary>Price per share at time of upload.</summary>
        public decimal Price { get; set; }
    }
}
