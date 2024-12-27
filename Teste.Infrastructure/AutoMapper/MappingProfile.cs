using AutoMapper;
using Teste.Infrastructure.Entities;
using Teste.Shared.Models;

namespace Teste.Infrastructure.AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, OrderModel>();
        CreateMap<Customer, CustomerModel>();
        CreateMap<OrderItem,  OrderItemModel>();
    }
}
