using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Services;
using backend.backendAPI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=data.db"));

builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<RiskCalculationService>();

var app = builder.Build();


// this adds Swagger API Dashboard: http://localhost:5233/swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// this is the default routing when you do "dotnet run"
app.MapGet("/", () => "Backend API is currently running!\n go to http://localhost:5233/swagger");


using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
