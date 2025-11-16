using System; 
using System.ComponentModel.DataAnnotations; 
using Microsoft.AspNetCore.Http; 

namespace backend.backendAPI.DTO { 
    public class PortfolioUploadDTO { 
        [Required] 
        public string Name {get; set;} 
        [Required] 
        public IFormFile File {get; set;} 
    } 
}