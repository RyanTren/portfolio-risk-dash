using Microsoft.AspNetCore.Mvc;
using backend.backendAPI.Interfaces;
using backend.backendAPI.DTO;

namespace backend.backendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _svc;

        public PortfolioController(IPortfolioService svc)
        {
            _svc = svc;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _svc.GetPortfoliosAsync();
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _svc.GetPortfolioAsync(id);
            if (p == null)
                return NotFound();

            var dto = new PortfolioUploadResponseDTO
            {
                Id = p.Id,
                Name = p.Name,
                PositionCount = p.Positions.Count,
                CreatedAt = p.CreatedAt
            };

            return Ok(dto);
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] PortfolioUploadDTO request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file uploaded");

            
            using var stream = request.File.OpenReadStream();

            var created = await _svc.CreateFromCsvAsync(request.Name ?? "Uploaded Portfolio", stream);

            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
    }
}
