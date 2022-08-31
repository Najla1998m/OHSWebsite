using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Departement_DepartementDtoProfile : Profile
    {
        public Departement_DepartementDtoProfile()
        {
            CreateMap<Departement, DepartementDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}