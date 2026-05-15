using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using RangeTech.ServiceApp.Api.Application;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddMediatR(configuration =>
    configuration.RegisterServicesFromAssembly(typeof(ApplicationAssemblyMarker).Assembly));

var mapsterConfig = TypeAdapterConfig.GlobalSettings;
FeatureMappingConfig.RegisterMappings(mapsterConfig);
builder.Services.AddSingleton(mapsterConfig);
builder.Services.AddScoped<IMapper, ServiceMapper>();
builder.Services.AddFeatureServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MobileClient", policy =>
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("MobileClient");
app.UseAuthorization();
app.MapControllers();

app.Run();
