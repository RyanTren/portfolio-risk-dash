namespace backend.backendAPI.Models
{
    /// <summary>
    /// Represents the status of a risk calculation.
    /// </summary>
    public enum RiskResultStatus
    {
        /// <summary>Job is queued but not started.</summary>
        Pending = 0,

        /// <summary>Calculation is in progress.</summary>
        Running = 1,

        /// <summary>Calculation finished successfully.</summary>
        Completed = 2,

        /// <summary>Calculation failed with an error.</summary>
        Failed = 3
    }
}
