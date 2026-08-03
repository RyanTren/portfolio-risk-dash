namespace backend.backendAPI.DTO.Requests
{
    /// <summary>
    /// Request payload for starting a risk calculation run.
    /// </summary>
    public class StartRiskRequest
    {
        /// <summary>ID of the portfolio to analyze.</summary>
        public int PortfolioId { get; set; }
    }
}
