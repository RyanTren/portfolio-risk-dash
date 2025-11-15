using Microsoft.AspNetCore.Mvc;
using backend.backendAPI.Interfaces;

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

            return Ok(p);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromQuery] string name)
        {
            if (Request.Form.Files.Count == 0)
                return BadRequest("No file uploaded");

            var file = Request.Form.Files[0];
            using var stream = file.OpenReadStream();

            var created = await _svc.CreateFromCsvAsync(name ?? "Uploaded Portfolio", stream);

            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
    }
}
