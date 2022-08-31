using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{

    public class DepartmentTypeRoleDTO_DepartmentTypeRole_profile : Profile
    {
        public DepartmentTypeRoleDTO_DepartmentTypeRole_profile()
        {
            CreateMap<DepartmentTypeRole, DepartmentTypeRoleDTO>().ReverseMap();
        }
    }
}
