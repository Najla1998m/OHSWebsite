using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // CreateMap<AppUser, UserAdminDto>();
            // CreateMap<IdentityUser, UserAdminDto>()
            //     .Include<AppUser, UserAdminDto>()
            //     .ForMember(s => s.IsActive, m => m.Ignore());
            // .ForMember(m => m.Id, opt => opt.Ignore());
            //Company
        }
    }
}