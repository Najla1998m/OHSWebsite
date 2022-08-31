using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{
    public class ContactUsMsg_ContactUsMsgDtoProfile : Profile
    {
        public ContactUsMsg_ContactUsMsgDtoProfile()
        {
            CreateMap<ContactUsMsg, ContactUsMsgDto>()
                .ForMember(s => s.MessageDate,
                    opt => opt.MapFrom(s => s.MessageDate
                                            .ToString("dddd, dd MMMM yyyy")))
                .ReverseMap()
                .ForMember(s => s.MessageDate, opt => opt.Ignore());
            CreateMap<CreateContactUsMsgDto, ContactUsMsg>();
        }
    }
}
