using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.backendAPI.Interfaces;
using backend.backendAPI.DTO.Requests;
using backend.backendAPI.DTO.Responses;
using backend.backendAPI.Services;

namespace backend.backendAPI.Controllers
{
    /// <summary>
    /// API endpoints for managing portfolios.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _svc;

        /// <summary>
        /// Initializes a new instance of the <see cref="PortfolioController"/> class.
        /// </summary>
        public PortfolioController(IPortfolioService svc)
        {
            _svc = svc;
        }

        /// <summary>
        /// Retrieves all portfolios with their positions.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<PortfolioResponse>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var list = await _svc.GetPortfoliosAsync();
            var response = list.Select(PortfolioService.MapToResponse).ToList();
            return Ok(response);
        }

        /// <summary>
        /// Retrieves a single portfolio by ID with its positions.
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(PortfolioResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _svc.GetPortfolioAsync(id);
            if (p is null)
                return NotFound();

            return Ok(PortfolioService.MapToResponse(p));
        }

        /// <summary>
        /// Uploads a CSV file to create a new portfolio. Requires authentication.
        /// </summary>
        [Authorize]
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(PortfolioResponse), 201)]
        public async Task<IActionResult> Upload([FromForm] PortfolioUploadRequest request)
        {
            if (request.File is null || request.File.Length == 0)
                return BadRequest("No file uploaded");

            using var stream = request.File.OpenReadStream();
            var created = await _svc.CreateFromCsvAsync(request.Name ?? "Uploaded Portfolio", stream);

            return CreatedAtAction(nameof(Get), new { id = created.Id }, PortfolioService.MapToResponse(created));
        }

        /// <summary>
        /// Deletes a portfolio by ID. Requires authentication.
        /// </summary>
        [Authorize]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _svc.DeletePortfolioAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
