using backend.backendAPI.Models;

namespace backend.backendAPI.Interfaces
{
    public interface IPortfolioService
    {
        Task<Portfolio> CreateFromCsvAsync(string portfolioName, Stream csvStream);
        Task<List<Portfolio>> GetPortfoliosAsync();
        Task<Portfolio?> GetPortfolioAsync(int id);
        Task<bool> DeletePortfolioAsync(int id);

    }
}