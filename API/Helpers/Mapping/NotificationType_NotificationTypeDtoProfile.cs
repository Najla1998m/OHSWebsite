using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class NotificationType_NotificationTypeDtoProfile : Profile
    {
        public NotificationType_NotificationTypeDtoProfile()
        {
            CreateMap<NotificationType, NotificationTypeDto>()
              .ReverseMap()
              .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}