using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Tasks_TasksDtoProfile : Profile
    {
        public Tasks_TasksDtoProfile()
        {
            CreateMap<Tasks, TasksDto>()

              .ForMember(m => m.Number, opt => opt.MapFrom(x => "TSK_" + x.Number.ToString()))
              .ReverseMap()
             .ForMember(m => m.Number, opt => opt.Ignore());


            CreateMap<UpdateTasksDto, Tasks>()
                .ForMember(m => m.Number, opt => opt.Ignore());
            //CreateMap<TasksDto, Tasks>()
            //  .ForMember(m => m.Id, opt => opt.Ignore());

        }
    }
}