using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{
    public class UserDepartmentsDto_UserDepartmentsProfile : Profile
    {
        public UserDepartmentsDto_UserDepartmentsProfile()
        {
            CreateMap<UserDepartments, UserDepartmentsDto>()
               .ForMember(s => s.Id, opt => opt.MapFrom(a => a.Departement.Id))
               .ForMember(s => s.Name, opt => opt.MapFrom(a => a.Departement.Name))
               .ReverseMap();
        }
    }
}
