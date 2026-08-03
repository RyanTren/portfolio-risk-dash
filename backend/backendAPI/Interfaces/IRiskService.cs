using backend.backendAPI.Models;

namespace backend.backendAPI.Interfaces
{
    /// <summary>
    /// Service for managing risk calculations and retrieving risk results.
    /// </summary>
    public interface IRiskService
    {
        /// <summary>
        /// Starts a new risk calculation run for the specified portfolio.
        /// </summary>
        /// <param name="portfolioId">The ID of the portfolio to analyze.</param>
        /// <returns>The ID of the created risk result record.</returns>
        Task<int> StartRiskRunAsync(int portfolioId);

        /// <summary>
        /// Retrieves the risk result by its ID.
        /// </summary>
        /// <param name="riskId">The risk result ID.</param>
        /// <returns>The risk result, or null if not found.</returns>
        Task<RiskResult?> GetRiskResultAsync(int riskId);
    }
}
