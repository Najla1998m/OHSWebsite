using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Stock_StockDtoProfile : Profile
    {
        public Stock_StockDtoProfile()
        {
            CreateMap<Stock, StockDto>()
            .ReverseMap()
            .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}