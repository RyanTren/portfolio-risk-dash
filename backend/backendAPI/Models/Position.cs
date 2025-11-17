using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.backendAPI.Models
{
    public class Position
    {
        [Key] // Primary Key
        public int Id {get; set;}

        public int PortfolioId {get; set;}

          [JsonIgnore] //prevent infinite cycle for POST/api/Portfolio/upload
        public Portfolio? Portfolio {get; set;}

        [Required]
        public required string? Ticker {get; set;}
        public decimal Quantity {get; set;}
        public decimal Price {get; set;}

    }
}