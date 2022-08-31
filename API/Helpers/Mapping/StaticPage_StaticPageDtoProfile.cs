using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class StaticPage_StaticPageDtoProfile : Profile
    {
        public StaticPage_StaticPageDtoProfile()
        {
            CreateMap<StaticPage, StaticPageDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}