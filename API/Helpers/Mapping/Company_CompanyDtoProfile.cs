using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Company_CompanyDtoProfile : Profile
    {
        public Company_CompanyDtoProfile()
        {
            CreateMap<Company, CompanyDto>()
                   .ForMember(m => m.Logo, opt => opt.MapFrom(x => x.Logo == null || x.Logo == "" ? "": "https://ohsjoeq.com/Images/Clients/" + x.Logo))
                .ReverseMap();
            //  .ForMember(m => m.Logo, opt => opt.MapFrom(x => "https://ohsjoeq.com/Images/Clients/" + x.Logo));
        }
    }
}