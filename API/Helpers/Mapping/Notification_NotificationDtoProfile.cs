using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Notification_NotificationDtoProfile : Profile
    {
        public Notification_NotificationDtoProfile()
        {

            CreateMap<Notification, NotificationDto>()
                //.ForMember(s => s.Date,
                //    opt => opt.MapFrom(s => s.Date.ToString("dddd, dd MMMM yyyy")))
                .ReverseMap()
               // .ForMember(s => s.Date, opt => opt.Ignore())
                .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}