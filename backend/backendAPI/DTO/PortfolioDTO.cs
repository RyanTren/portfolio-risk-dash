using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using backend.backendAPI.Models;


namespace backend.backendAPI.DTO
{
    public class PortfolioDTO
    {
        public int Id {get; set;}

        public string Name {get; set;} = "";
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

        public IList<Position> Positions {get; set;} = new List<Position>();
    }
}