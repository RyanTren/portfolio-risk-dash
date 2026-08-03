using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.backendAPI.DTO.Requests
{
    /// <summary>
    /// Request payload for uploading a portfolio via CSV file.
    /// </summary>
    public class PortfolioUploadRequest
    {
        /// <summary>Name for the new portfolio.</summary>
        [Required]
        public required string Name { get; set; }

        /// <summary>CSV file containing position data.</summary>
        [Required]
        public required IFormFile File { get; set; }
    }
}
