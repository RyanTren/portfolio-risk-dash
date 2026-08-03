namespace backend.backendAPI.Helpers
{
    /// <summary>
    /// Configuration options for risk calculation parameters.
    /// </summary>
    public class RiskCalculationOptions
    {
        /// <summary>Section name in appsettings.json.</summary>
        public const string SectionName = "RiskCalculation";

        /// <summary>Annualized volatility assumption (default 2%).</summary>
        public double Volatility { get; set; } = 0.02;

        /// <summary>VaR confidence multiplier — 1.65 for 95% confidence (default).</summary>
        public double VarMultiplier { get; set; } = 1.65;

        /// <summary>Stress loss percentage (default 5%).</summary>
        public decimal StressLossPercent { get; set; } = 0.05m;
    }

    /// <summary>
    /// Static helper methods for risk calculations.
    /// Extracted from RiskCalculationService for testability and reuse.
    /// </summary>
    public static class RiskCalculationHelpers
    {
        /// <summary>
        /// Calculates the Value at Risk (VaR) for a given portfolio value.
        /// VaR = PortfolioValue × (Multiplier × Volatility)
        /// </summary>
        /// <param name="portfolioValue">Total value of the portfolio.</param>
        /// <param name="volatility">Annualized volatility (e.g., 0.02 for 2%).</param>
        /// <param name="multiplier">Confidence multiplier (e.g., 1.65 for 95%).</param>
        /// <returns>The VaR amount.</returns>
        public static decimal CalculateVaR(decimal portfolioValue, double volatility, double multiplier)
        {
            return portfolioValue * (decimal)(multiplier * volatility);
        }

        /// <summary>
        /// Calculates the projected loss under a stress scenario.
        /// </summary>
        /// <param name="portfolioValue">Total value of the portfolio.</param>
        /// <param name="stressPercent">Stress loss percentage (e.g., 0.05 for 5%).</param>
        /// <returns>The stress loss amount.</returns>
        public static decimal CalculateStressLoss(decimal portfolioValue, decimal stressPercent)
        {
            return portfolioValue * stressPercent;
        }

        /// <summary>
        /// Calculates the total value of a set of positions.
        /// </summary>
        /// <param name="quantities">Array of position quantities.</param>
        /// <param name="prices">Array of position prices.</param>
        /// <returns>Total portfolio value.</returns>
        /// <exception cref="ArgumentException">Thrown when arrays have different lengths.</exception>
        public static decimal CalculatePortfolioValue(decimal[] quantities, decimal[] prices)
        {
            if (quantities.Length != prices.Length)
                throw new ArgumentException("Quantities and prices arrays must have the same length.");

            decimal total = 0;
            for (int i = 0; i < quantities.Length; i++)
            {
                total += quantities[i] * prices[i];
            }
            return total;
        }
    }
}
