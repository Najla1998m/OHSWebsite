using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class PackageCriteria_PackageCriteriaDtoProfile : Profile
    {
        public PackageCriteria_PackageCriteriaDtoProfile()
        {
            CreateMap<PackageCriteria, PackageCriteriaDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}