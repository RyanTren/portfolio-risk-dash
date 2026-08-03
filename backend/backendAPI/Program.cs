using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using backend.backendAPI.Data;
using backend.backendAPI.Data.SeedData;
using backend.backendAPI.Services;
using backend.backendAPI.Interfaces;
using backend.backendAPI.Mappings;
using backend.backendAPI.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Configuration options
builder.Services.Configure<RiskCalculationOptions>(
    builder.Configuration.GetSection(RiskCalculationOptions.SectionName));

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

// JWT Authentication
var jwtConfig = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig.Issuer,
            ValidAudience = jwtConfig.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtConfig.SecretKey))
        };

        // Read JWT from httpOnly cookie instead of Authorization header
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Check for token in cookie first
                var token = context.Request.Cookies["AccessToken"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                // Return 401 instead of redirecting to login page
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsJsonAsync(new 
                { 
                    error = "Unauthorized", 
                    message = "You must be logged in to access this resource." 
                });
            }
        };
    });

builder.Services.AddAuthorization();

// Add CORS so React can call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for cookies
    });
});

// Rate Limiters
builder.Services.AddRateLimiter(options =>
{
    // Risk calculation limiter
    options.AddFixedWindowLimiter("riskLimiter", config =>
    {
        config.PermitLimit = 5;
        config.Window = TimeSpan.FromSeconds(30);
        config.QueueLimit = 0;
    });

    // Auth endpoint limiter (stricter)
    options.AddFixedWindowLimiter("authLimiter", config =>
    {
        config.PermitLimit = 10;
        config.Window = TimeSpan.FromMinutes(1);
        config.QueueLimit = 0;
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IRiskService, RiskCalculationService>();
builder.Services.AddSingleton<IRiskStateService, RiskStateService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio Risk Dashboard API V1");
        c.RoutePrefix = string.Empty;
    });
}
else
{
    app.MapGet("/", () => Results.Json(new
    {
        status = "Backend API is running! Go to /swagger"
    }));
}

// Apply CORS before controllers
app.UseCors("AllowFrontend");

// HTTPS redirect (enable in production)
// app.UseHttpsRedirection();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto migrations and seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await SeedData.InitializeAsync(scope.ServiceProvider);
}

app.Run();
