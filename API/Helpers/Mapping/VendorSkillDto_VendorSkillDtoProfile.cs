using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{
    public class VendorSkillDto_VendorSkillDtoProfile:Profile
    {
        public VendorSkillDto_VendorSkillDtoProfile()
        {
            CreateMap<VendorSkill, VendorSkillDto>().ReverseMap();
        }
    }
}
