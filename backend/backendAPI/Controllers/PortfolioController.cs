using System;
using Microsoft.AspNetCore.Mvc;


using backend.backendAPI.Services;
using backend.backendAPI.Models;


namespace backend.backendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioController _svc;
        public PortfolioController(IPortfolioController svc) {_svc = svc;}

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _svc.GetPortfolioAysnc();
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _svc.GetPortfolioAysnc(id);
            if(p == null)
            {
                return NotFound();
            }
            return Ok(p);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromQuery] string name)
        {
            if(Request.Form.Files.Count == 0)
            {
                return BadRequest("No file uploaded");
            }

            var file = Request.Form.Files[0];
            using var stream = file.OpenReadStream();
            var created = await _svc.CreateFromCsvAsync(name ?? "Uploaded Portfolio", stream);
            return CreatedAtAction(nameof(Get), new { id = created.Id}, created);
        }
    }
}