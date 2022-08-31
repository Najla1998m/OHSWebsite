using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Package_PackageDtoProfile : Profile
    {
        public Package_PackageDtoProfile()
        {
            CreateMap<Package, PackageDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}