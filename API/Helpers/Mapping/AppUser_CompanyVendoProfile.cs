using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class AppUser_CompanyVendoProfile : Profile
    {
        public AppUser_CompanyVendoProfile()
        {
            // CreateMap<AppUser, CompanyVendorRegisterDto>()
                        
            //          .ReverseMap()
            //          .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}