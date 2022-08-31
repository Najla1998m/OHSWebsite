using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class QuestionsPage_QuestionsPageDtoProfile : Profile
    {
        public QuestionsPage_QuestionsPageDtoProfile()
        {
            CreateMap<QuestionsPage, QuestionsPageDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}