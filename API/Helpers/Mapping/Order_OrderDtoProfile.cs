using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Order_OrderDtoProfile : Profile
    {
        public Order_OrderDtoProfile()
        {
            CreateMap<Order, OrderDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}