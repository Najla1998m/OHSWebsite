using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Skill_SkillDtoProfile : Profile
    {
        public Skill_SkillDtoProfile()
        {
            CreateMap<Skill, SkillDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}