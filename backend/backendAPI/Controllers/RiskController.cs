using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using backend.backendAPI.Interfaces;
using backend.backendAPI.DTO.Requests;

namespace backend.backendAPI.Controllers
{
    /// <summary>
    /// API endpoints for running risk calculations and checking their status.
    /// </summary>
    [ApiController]
    [Route("risk")]
    public class RiskController : ControllerBase
    {
        private readonly IRiskService _riskService;
        private readonly IRiskStateService _stateService;

        /// <summary>
        /// Initializes a new instance of the <see cref="RiskController"/> class.
        /// </summary>
        public RiskController(IRiskService riskService, IRiskStateService stateService)
        {
            _riskService = riskService;
            _stateService = stateService;
        }

        /// <summary>
        /// Starts a new risk calculation run for a portfolio. Requires authentication.
        /// Rate limited to 5 requests per 30 seconds per client.
        /// </summary>
        [Authorize]
        [EnableRateLimiting("riskLimiter")]
        [HttpPost("run")]
        public async Task<IActionResult> StartRun([FromBody] StartRiskRequest req)
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            if (!_stateService.CanRun(ip, req.PortfolioId))
                return BadRequest("Please wait before running again or a job is already in progress.");

            _stateService.MarkRunning(ip, req.PortfolioId);

            try
            {
                int jobId = await _riskService.StartRiskRunAsync(req.PortfolioId);
                return Ok(new { jobId });
            }
            finally
            {
                _stateService.MarkComplete(req.PortfolioId);
            }
        }

        /// <summary>
        /// Retrieves the status and results of a risk calculation by ID.
        /// </summary>
        [HttpGet("status/{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var result = await _riskService.GetRiskResultAsync(id);
            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}