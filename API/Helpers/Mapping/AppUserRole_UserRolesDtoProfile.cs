using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class AppUserRole_UserRolesDtoProfile:Profile
    {
        public AppUserRole_UserRolesDtoProfile()
        {
            CreateMap<AppUserRole, UserRolesDto>()
                  .ForMember(s => s.Id, opt => opt.MapFrom(a => a.Role.Id))
                  .ForMember(s => s.Name, opt => opt.MapFrom(a => a.Role.Name))
                  .ReverseMap();
        }
    }
}