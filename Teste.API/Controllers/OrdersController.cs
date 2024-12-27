using Microsoft.AspNetCore.Mvc;
using Teste.Application.Abstractions;
using Teste.Shared.Args;
using Teste.Shared.Enums;

namespace Teste.API.Controllers;

[ApiController]
[Route("[controller]")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await orderService.GetOrdersAsync();

        return Ok(orders);
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrderById([FromRoute] Guid orderId)
    {
        var order = await orderService.GetOrderByIdAsync(orderId);

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> PostProcessOrder([FromBody] ProcessOrderPostArgs args)
    {
        var order = await orderService.ProcessOrderAsync(args);

        if (order.Status == OrderStatus.PENDENTE)
        {
            return Ok(new
            {
                message = "O pedido foi cadastrado com sucesso mas não foi possível efetuar a venda (erro em serviço externo)",
                orderStatus = order.Status,
                order
            });
        }

        return Ok(order);
    }

    [HttpPut("{orderId}")]
    public IActionResult PutProcessOrder([FromRoute] Guid orderId)
    {
        return Ok(orderId);
    }
}
