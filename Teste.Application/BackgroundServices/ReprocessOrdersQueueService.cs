using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Text;
using Teste.Infrastructure.Context;
using Teste.Shared;
using Teste.Shared.Enums;

namespace Teste.Application.BackgroundServices;

public class ReprocessOrdersQueueService(
    ILogger<ReprocessOrdersQueueService> logger,
    IServiceProvider serviceProvider,
    IOptions<OrderProcessingAPISettings> options) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using PeriodicTimer timer = new(TimeSpan.FromSeconds(15));

        logger.LogInformation("#### Fila de reprocessamento iniciada");

        while (!stoppingToken.IsCancellationRequested)
        {
            await timer.WaitForNextTickAsync(stoppingToken);

            try
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var httpClient = scope.ServiceProvider.GetRequiredService<HttpClient>();

                httpClient.BaseAddress = new Uri(options.Value.URL);
                httpClient.DefaultRequestHeaders.Add("email", options.Value.Email);

                logger.LogInformation($"#### teste: {httpClient.BaseAddress}");

                var queue = await context
                    .ReprocessingOrdersQueue
                    .OrderBy(item => item.CreatedAt)
                    .Take(5)
                    .ToListAsync(stoppingToken);

                foreach (var item in queue)
                {
                    if (item.Retries > 5)
                    {
                        await context.Database.BeginTransactionAsync(stoppingToken);

                        try
                        {
                            await UpdateOrderStatus(context, item.Id, OrderStatus.CANCELADO);

                            context.ReprocessingOrdersQueue.Remove(item);

                            await context.SaveChangesAsync(stoppingToken);
                            await context.Database.CommitTransactionAsync(stoppingToken);

                            continue;
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex, "#### Erro ao descartar pedido");
                            await context.Database.RollbackTransactionAsync(stoppingToken);
                            throw;
                        }
                    }

                    try
                    {
                        var content = new StringContent(item.OrderData, Encoding.UTF8, "application/json");
                        var response = await httpClient.PostAsync("/api/vendas", content, stoppingToken);

                        if (!response.IsSuccessStatusCode)
                        {
                            item.Retries += 1;
                        } else
                        {
                            await UpdateOrderStatus(context, item.OrderId, OrderStatus.CONCLUIDO);

                            context.ReprocessingOrdersQueue.Remove(item);

                            await context.SaveChangesAsync(stoppingToken);
                            await context.Database.CommitTransactionAsync(stoppingToken);
                        }
                    }
                    catch (Exception ex) {
                        logger.LogError(ex, "#### Erro ao processar pedido.");
                        item.Retries += 1;
                    }
                }

                await context.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "##### Erro ao executar background service de fila de reprocessamento de pedidos");
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }

        logger.LogInformation("##### Processamento da fila finalizado.");
    }

    private static async Task UpdateOrderStatus(AppDbContext context, Guid orderId, OrderStatus status)
    {
        var order = await context
            .Order
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order is not null)
        {
            order.Status = status;
            context.Update(order);
        }
    }
}
