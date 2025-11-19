using System; 
using System.ComponentModel.DataAnnotations; 
using Microsoft.AspNetCore.Http; 

namespace backend.backendAPI.DTO { 
    public class PortfolioUploadDTO { 
        [Required] 
        public required string Name {get; set;} 
        [Required] 
        public required IFormFile File {get; set;} 
    } 
}