using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Product_ProductDtoProfile : Profile
    {
        public Product_ProductDtoProfile()
        {
            CreateMap<Product, ProductDto>()
                .ReverseMap()
                .ForMember(m => m.Id, opt => opt.Ignore());

            CreateMap<CreateProductDto, Product>()
                .ReverseMap();
        }
    }
}