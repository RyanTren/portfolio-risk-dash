using backend.backendAPI.Models;

namespace backend.backendAPI.Interfaces
{
    /// <summary>
    /// Service for managing portfolio CRUD operations and CSV import.
    /// </summary>
    public interface IPortfolioService
    {
        /// <summary>
        /// Creates a new portfolio by parsing a CSV stream.
        /// </summary>
        /// <param name="portfolioName">Name for the new portfolio.</param>
        /// <param name="csvStream">Stream containing CSV data.</param>
        /// <returns>The created portfolio entity.</returns>
        Task<Portfolio> CreateFromCsvAsync(string portfolioName, Stream csvStream);

        /// <summary>
        /// Retrieves all portfolios with their positions.
        /// </summary>
        Task<List<Portfolio>> GetPortfoliosAsync();

        /// <summary>
        /// Retrieves a single portfolio by ID with its positions.
        /// </summary>
        /// <param name="id">Portfolio ID.</param>
        /// <returns>The portfolio, or null if not found.</returns>
        Task<Portfolio?> GetPortfolioAsync(int id);

        /// <summary>
        /// Deletes a portfolio by ID.
        /// </summary>
        /// <param name="id">Portfolio ID.</param>
        /// <returns>True if deleted; false if not found.</returns>
        Task<bool> DeletePortfolioAsync(int id);
    }
}