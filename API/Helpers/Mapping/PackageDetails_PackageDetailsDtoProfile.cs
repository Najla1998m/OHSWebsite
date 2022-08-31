using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class PackageDetails_PackageDetailsDtoProfile : Profile
    {
        public PackageDetails_PackageDetailsDtoProfile()
        {
            CreateMap<PackageDetails, PackageDetailsDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}