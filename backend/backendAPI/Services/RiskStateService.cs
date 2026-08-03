using backend.backendAPI.Interfaces;

namespace backend.backendAPI.Services
{
    /// <summary>
    /// Singleton service that tracks risk job cooldowns (per IP) and
    /// concurrency locks (per portfolio) in memory.
    /// </summary>
    public class RiskStateService : IRiskStateService
    {
        private readonly Dictionary<string, DateTime> _lastRunByIp = new();
        private readonly HashSet<int> _runningJobs = new();
        private readonly object _lock = new();
        private static readonly TimeSpan Cooldown = TimeSpan.FromSeconds(60);

        /// <inheritdoc/>
        public bool CanRun(string ip, int portfolioId)
        {
            lock (_lock)
            {
                if (_lastRunByIp.TryGetValue(ip, out var last)
                    && DateTime.UtcNow - last < Cooldown)
                    return false;

                if (_runningJobs.Contains(portfolioId))
                    return false;

                return true;
            }
        }

        /// <inheritdoc/>
        public void MarkRunning(string ip, int portfolioId)
        {
            lock (_lock)
            {
                _lastRunByIp[ip] = DateTime.UtcNow;
                _runningJobs.Add(portfolioId);
            }
        }

        /// <inheritdoc/>
        public void MarkComplete(int portfolioId)
        {
            lock (_lock)
            {
                _runningJobs.Remove(portfolioId);
            }
        }
    }
}
