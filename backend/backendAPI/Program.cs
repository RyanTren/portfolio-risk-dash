using Microsoft.EntityFrameworkCore;
using backend.backendAPI.Data;
using backend.backendAPI.Services;
using backend.backendAPI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// adds services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// database stuff
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=data.db"));

// DI
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<RiskCalculationService>();

var app = builder.Build();


// this adds Swagger API Dashboard: http://localhost:5233/swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        c.RoutePrefix = string.Empty; // this makes swagger the root url 
    });
}
else
{
    app.MapGet("/", () => Results.Json(new { status = "Backend API is running! \n Go to http://localhost:5233/swagger" }));
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

//  applies migrations automatically in dev
using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); 
    db.Database.Migrate(); //aplied any pending migrations
}

app.Run();
