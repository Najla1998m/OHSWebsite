using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class TasksAttachmentDTO_TasksAttachment : Profile
    {
        public TasksAttachmentDTO_TasksAttachment()
        {
            CreateMap<TasksAttachmentDTO, TasksAttachment>().ReverseMap();
        }
    }
}