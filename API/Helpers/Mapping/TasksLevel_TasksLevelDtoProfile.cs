using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class TasksLevel_TasksLevelDtoProfile : Profile
    {
        public TasksLevel_TasksLevelDtoProfile()
        {
            CreateMap<TasksLevel, TasksLevelDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}