using System;
using System.Collections.Generic;

namespace backend.backendAPI.Models
{
    public class Portfolio
    {
        public int Id {get; set;}
        public string Name {get; set;} = "";
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

        public IList<Position> Positions {get; set;} = new List<Position>();
    }
}