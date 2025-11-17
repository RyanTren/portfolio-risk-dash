using System.ComponentModel.DataAnnotations; 

namespace backend.backendAPI.DTO{ 
    public class PortfolioUploadResponseDTO { 
        public int Id {get; set;} 
        
        [Required]
        public required string Name {get; set;} 
        public int PositionCount {get; set;} 
        public DateTime CreatedAt {get; set;} 
    } 
}