using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class AppUser_RegisterDtoProfile : Profile
    {
        public AppUser_RegisterDtoProfile()
        {
            CreateMap<RegisterDto, AppUser>();
        }
    }
}