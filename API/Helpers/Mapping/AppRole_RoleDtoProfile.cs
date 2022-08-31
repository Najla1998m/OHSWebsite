using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class AppRole_RoleDtoProfile : Profile
    {
        public AppRole_RoleDtoProfile()
        {
            CreateMap<AppRole, RoleDto>();
        }
    }
}