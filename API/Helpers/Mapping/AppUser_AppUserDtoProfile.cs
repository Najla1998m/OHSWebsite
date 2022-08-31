using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class AppUser_AppUserDtoProfile : Profile
    {
        public AppUser_AppUserDtoProfile()
        {
            CreateMap<AppUser, AppUserDto>()
                .ForMember(s => s.IsVerified, opt => opt.MapFrom(s => s.IsActive))
                 .ForMember(s => s.UserPhoto, opt => opt.MapFrom(s => s.UserPhoto != null ? "https://ohsjoeq.com/Images/Clients/" + s.UserPhoto : null))
                .ReverseMap()
                .ForMember(m => m.Id, opt => opt.Ignore())
                //.ForMember(s => s.UserPhoto, opt => opt.MapFrom(s => /*s.UserPhoto != null ?*/ "https://ohsjoeq.com/Images/Clients/" /*+ s.UserPhoto : null*/))
                .ForMember(m => m.UserRoles, opt => opt.Ignore())
                .ForMember(m => m.UserDepartments, opt => opt.Ignore());



        }
    }
}