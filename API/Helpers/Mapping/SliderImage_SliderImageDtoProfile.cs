using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class SliderImage_SliderImageDtoProfile : Profile
    {
        public SliderImage_SliderImageDtoProfile()
        {
            CreateMap<SliderImage, SliderImageDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}