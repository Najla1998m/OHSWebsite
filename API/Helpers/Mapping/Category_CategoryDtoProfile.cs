using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Category_CategoryDtoProfile : Profile
    {
        public Category_CategoryDtoProfile()
        {

            CreateMap<Category, CategoryDto>()
                .ReverseMap()
                .ForMember(m => m.Id, opt => opt.Ignore());

        }
    }
}