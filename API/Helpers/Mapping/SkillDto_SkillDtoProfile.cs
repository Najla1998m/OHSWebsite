using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{
    public class SkillDto_SkillDtoProfile:Profile
    {
        public SkillDto_SkillDtoProfile()
        {
            CreateMap<SkillDto, Skill>().ReverseMap();
        }
    }
}
