using Microsoft.AspNetCore.Mvc;
using Teste.Application.Abstractions;
using Teste.Infrastructure.Entities;
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
        try
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
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{orderId}")]
    public async Task<IActionResult> EditAndReprocessOrder([FromRoute] Guid orderId, [FromBody] OrderPutArgs args)
    {
        try
        {
            var order = await orderService.EditOrderAsync(orderId, args);

            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{orderId}/customer")]
    public async Task<IActionResult> EditCustomer(
        [FromRoute] Guid orderId,
        [FromBody] CustomerPutArgs args)
    {
        try
        {
            var order = await orderService.EditCustomerAsync(orderId, args);

            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{orderId}/items/{itemId}")]
    public async Task<IActionResult> EditCustomer(
        [FromRoute] Guid orderId,
        [FromRoute] int itemId,
        [FromBody] OrderItemPutArgs args)
    {
        try
        {
            var order = await orderService.EditOrderItemAsync(orderId, itemId, args);

            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}
