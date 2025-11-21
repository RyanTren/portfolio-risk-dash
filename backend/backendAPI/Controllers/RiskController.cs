using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

using backend.backendAPI.Data;
using backend.backendAPI.Services;
using backend.backendAPI.Models;
using backend.backendAPI.Models.Requests;


namespace backend.backendAPI.Controllers
{
    [ApiController]
    [Route("risk")]
    public class RiskController : ControllerBase
    {
        private readonly RiskCalculationService _service;
        private readonly Dictionary<string, DateTime> _lastRunByIp = new();
        private static readonly HashSet<int> _runningJobs = new();
        private readonly AppDbContext _db;

        public RiskController(RiskCalculationService service, AppDbContext db)
        {
            _service = service;
            _db = db;
        }

        [EnableRateLimiting("riskLimiter")]
        [HttpPost("run")]
        public async Task<IActionResult> StartRun([FromBody] StartRiskRequest req)
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // --- Cooldown check (per IP) ---
            if (_lastRunByIp.TryGetValue(ip, out DateTime last))
            {
                if (DateTime.UtcNow - last < TimeSpan.FromSeconds(60))
                    return BadRequest("Please wait before running again.");
            }

            // --- One job per portfolio check ---
            if (_runningJobs.Contains(req.PortfolioId))
                return Conflict("A risk job is already running for this portfolio.");

            // Mark as active
            _runningJobs.Add(req.PortfolioId);
            _lastRunByIp[ip] = DateTime.UtcNow;

            int jobId;
            try
            {
                jobId = await _service.StartRiskRunAsync(req.PortfolioId);
            }
            finally
            {
                // job finished → unlock
                _runningJobs.Remove(req.PortfolioId);
            }

            return Ok(new { jobId });
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