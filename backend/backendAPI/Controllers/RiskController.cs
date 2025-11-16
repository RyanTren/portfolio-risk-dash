using System;
using Microsoft.AspNetCore.Mvc;
using backend.backendAPI.Data;
using backend.backendAPI.Services;
using backend.backendAPI.Models;

namespace backend.backendAPI.Controllers
{
    [ApiController]
    [Route("risk")]
    public class RiskController : ControllerBase
    {
        private readonly RiskCalculationService _service;
        private readonly AppDbContext _db;

        public RiskController(RiskCalculationService service, AppDbContext db)
        {
            _service = service;
            _db = db;
        }

        [HttpPost("run")]
        public async Task<IActionResult> StartRun()
        {
            int id = await _service.StartRiskRunAsync();
            return Ok(new {jobId = id});
        }

        [HttpGet("status/{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var result = await _db.RiskResults.FindAsync(id);
            if(result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
    }
}