using Microsoft.EntityFrameworkCore;
using Polly;
using Teste.Application.Abstractions;
using Teste.Application.BackgroundServices;
using Teste.Application.Services;
using Teste.Infrastructure.Context;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<IOrderService, OrderService>();

var FaturamentoExternalURL = builder.Configuration["FaturamentoAPI:URL"]
    ?? throw new InvalidOperationException("FaturamentoAPI:URL não informado");
var FaturamentoEmail = builder.Configuration["FaturamentoAPI:Email"]
    ?? throw new InvalidOperationException("FaturamentoAPI:Email não informado");

builder.Services.AddHttpClient<IOrderService, OrderService>(client =>
{
    client.BaseAddress = new Uri(FaturamentoExternalURL);
    client.DefaultRequestHeaders.Add("email", FaturamentoEmail);
})
// Retry
.AddTransientHttpErrorPolicy(policyBuilder =>
    policyBuilder.WaitAndRetryAsync(5, retryAttemp => TimeSpan.FromSeconds(Math.Pow(3, retryAttemp)))
)
// Timeout
.AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(15)));

// Background service fila de reprocesamento
builder.Services.AddHostedService<ReprocessOrdersQueueService>();

// HttpClient do background service
builder.Services.AddHttpClient<ReprocessOrdersQueueHttpClient>(client =>
{
    client.BaseAddress = new Uri(FaturamentoExternalURL);
    client.DefaultRequestHeaders.Add("email", FaturamentoEmail);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
