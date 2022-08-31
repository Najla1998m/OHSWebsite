using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Setting_SettingDtoProfile : Profile
    {
        public Setting_SettingDtoProfile()
        {
            CreateMap<Setting, SettingDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}