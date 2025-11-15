namespace backend.backendAPI.Models
{
    public class Position
    {
        public int Id {get; set;}
        public int PortfolioId {get; set;}
        public Portfolio? Portfolio {get; set;}

        public string Ticker {get; set;} = "";
        public decimal Quantity {get; set;}
        public decimal Price {get; set;}

    }
}