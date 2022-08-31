using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class SubscriptionTypeAttachment_SubscriptionTypeAttachmentDtoProfile : Profile
    {
        public SubscriptionTypeAttachment_SubscriptionTypeAttachmentDtoProfile()
        {
            CreateMap<SubscriptionTypeAttachment, SubscriptionTypeAttachmentDto>()
                        .ReverseMap()
                        .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}