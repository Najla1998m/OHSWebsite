using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class VendorSkill_VendorSkillDtoProfile : Profile
    {
        public VendorSkill_VendorSkillDtoProfile()
        {
            CreateMap<VendorSkill, VendorSkillDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
            CreateMap<CreateVendorSkillDto, VendorSkill>()
              .ReverseMap();
            CreateMap<VendorSkill, UserDetailsSkillsDto>()
              .ReverseMap();
        }
    }
}