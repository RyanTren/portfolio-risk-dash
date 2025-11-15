using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddController();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configureation.GetConnectionString("DefaultConnection") ?? "Data Source=data.db"));

builder.Services.AddScoped<IPortfolioService, PortfolioService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
