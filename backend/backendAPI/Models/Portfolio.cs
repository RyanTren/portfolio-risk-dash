using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace backend.backendAPI.Models
{
    public class Portfolio
    {
        [Key] // Primary Key
        public int Id {get; set;}

        public string Name {get; set;} = "";
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

        public IList<Position> Positions {get; set;} = new List<Position>();
    }
}