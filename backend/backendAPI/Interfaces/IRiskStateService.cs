namespace backend.backendAPI.Interfaces
{
    /// <summary>
    /// Tracks in-memory state for risk job cooldowns and concurrency.
    /// Registered as a singleton so state persists across requests.
    /// </summary>
    public interface IRiskStateService
    {
        /// <summary>
        /// Checks whether a new risk run is allowed for the given IP and portfolio.
        /// </summary>
        /// <param name="ip">The client IP address.</param>
        /// <param name="portfolioId">The portfolio ID to check.</param>
        /// <returns>True if the run is allowed; false if cooldown or concurrency blocks it.</returns>
        bool CanRun(string ip, int portfolioId);

        /// <summary>
        /// Marks a risk run as active for the given IP and portfolio.
        /// </summary>
        void MarkRunning(string ip, int portfolioId);

        /// <summary>
        /// Marks a risk run as complete for the given portfolio.
        /// </summary>
        void MarkComplete(int portfolioId);
    }
}
