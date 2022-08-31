using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class TasksStatus_TasksStatusDtoProfile : Profile
    {
        public TasksStatus_TasksStatusDtoProfile()
        {
            CreateMap<TasksStatus, TasksStatusDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}