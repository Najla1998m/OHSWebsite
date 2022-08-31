using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class StockProducts_StockProductsDtoProfile : Profile
    {
        public StockProducts_StockProductsDtoProfile()
        {
            CreateMap<StockProducts, StockProductsDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());

            CreateMap<StockProductsForStockDto, StockProducts>().ReverseMap();
        }
    }
}