using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Services;
using backend.backendAPI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS so React can call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=data.db"));

// DI
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<RiskCalculationService>();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
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

// ✔ Apply CORS before controllers
app.UseCors("AllowFrontend");

// ❌ Disable HTTPS redirect in development
// app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Auto migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    db.Database.Migrate();
}

app.Run();
