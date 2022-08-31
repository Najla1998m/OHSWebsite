using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class AddDepartmentToUserDto_UserDepartmentProfile : Profile
    {
        public AddDepartmentToUserDto_UserDepartmentProfile()
        {

            CreateMap<AddDepartmentToUserDto, UserDepartments>();
        }

    }
}