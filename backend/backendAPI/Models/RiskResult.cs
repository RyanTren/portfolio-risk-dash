using System;
using System.ComponentModel.DataAnnotations;

namespace backend.backendAPI.Models
{
    public class RiskResult
    {
        [Key] // sets riskId as the Primary Key
        public int riskId {get; set;}

        public int PortfolioId {get; set;}
        public DateTime Timestamp {get; set;} = DateTime.UtcNow;

        public decimal? PortfolioValue {get; set;}
        public decimal? VaR {get; set;}
        public decimal? StressLoss {get; set;}

        public string Status {get; set;} = "Pending"; //pending, runing, completed, failed
    }
}