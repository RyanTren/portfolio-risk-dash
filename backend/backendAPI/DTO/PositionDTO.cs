using System.ComponentModel.DataAnnotations; 

namespace backend.backendAPI.DTO
{
    public class PositionDTO
    {
        public int Id {get; set;}
        public int PortfolioId {get; set;}
        [Required]
        public required string Ticker {get; set;}
        public decimal Quantity {get; set;}
        public decimal Price {get; set;}
    }
}