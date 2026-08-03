using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Models;

namespace backend.backendAPI.Controllers
{
    /// <summary>
    /// Admin-only API endpoints for managing users and viewing portfolios.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        /// <summary>
        /// Initializes a new instance of the <see cref="AdminController"/> class.
        /// </summary>
        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Retrieves all users (Admin only). Excludes sensitive password data.
        /// </summary>
        [HttpGet("users")]
        [ProducesResponseType(typeof(List<UserResponse>), 200)]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Retrieves a specific user by ID (Admin only).
        /// </summary>
        [HttpGet("users/{id:int}")]
        [ProducesResponseType(typeof(UserResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _db.Users
                .Where(u => u.Id == id)
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user is null)
                return NotFound();

            return Ok(user);
        }

        /// <summary>
        /// Retrieves portfolios for a specific user (Admin only).
        /// Excludes sensitive position details (stock tickers, quantities, prices).
        /// </summary>
        [HttpGet("users/{userId:int}/portfolios")]
        [ProducesResponseType(typeof(List<AdminPortfolioResponse>), 200)]
        public async Task<IActionResult> GetUserPortfolios(int userId)
        {
            // Check if user exists
            var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return NotFound("User not found.");

            var portfolios = await _db.Portfolios
                .Select(p => new AdminPortfolioResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    PositionCount = p.Positions.Count,
                    CreatedAt = p.CreatedAt,
                    RiskResultCount = p.RiskResults.Count
                })
                .ToListAsync();

            return Ok(portfolios);
        }

        /// <summary>
        /// Retrieves a specific portfolio with limited details (Admin only).
        /// Excludes sensitive position data (tickers, quantities, prices).
        /// </summary>
        [HttpGet("portfolios/{portfolioId:int}")]
        [ProducesResponseType(typeof(AdminPortfolioDetailResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetPortfolioDetail(int portfolioId)
        {
            var portfolio = await _db.Portfolios
                .Include(p => p.Positions)
                .Include(p => p.RiskResults)
                .FirstOrDefaultAsync(p => p.Id == portfolioId);

            if (portfolio is null)
                return NotFound();

            var response = new AdminPortfolioDetailResponse
            {
                Id = portfolio.Id,
                Name = portfolio.Name,
                CreatedAt = portfolio.CreatedAt,
                PositionCount = portfolio.Positions.Count,
                RiskResults = portfolio.RiskResults.Select(r => new AdminRiskResultSummary
                {
                    Id = r.RiskId,
                    PortfolioValue = r.PortfolioValue,
                    VaR = r.VaR,
                    StressLoss = r.StressLoss,
                    Timestamp = r.Timestamp
                }).ToList()
            };

            return Ok(response);
        }
    }

    /// <summary>
    /// User response DTO (excludes sensitive data).
    /// </summary>
    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Portfolio response DTO for admin view (excludes position details).
    /// </summary>
    public class AdminPortfolioResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int PositionCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int RiskResultCount { get; set; }
    }

    /// <summary>
    /// Portfolio detail response DTO for admin view.
    /// </summary>
    public class AdminPortfolioDetailResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int PositionCount { get; set; }
        public List<AdminRiskResultSummary> RiskResults { get; set; } = new();
    }

    /// <summary>
    /// Risk result summary DTO for admin view.
    /// </summary>
    public class AdminRiskResultSummary
    {
        public int Id { get; set; }
        public decimal? PortfolioValue { get; set; }
        public decimal? VaR { get; set; }
        public decimal? StressLoss { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
