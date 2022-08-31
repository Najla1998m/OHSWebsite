using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class SubscriptionTypeAttachmentMapping_SubscriptionTypeAttachmentMappingDtoProfile : Profile
    {
        public SubscriptionTypeAttachmentMapping_SubscriptionTypeAttachmentMappingDtoProfile()
        {
            CreateMap<SubscriptionTypeAttachmentMapping, SubscriptionTypeAttachmentMappingDto>()
            .ReverseMap();
        }
    }
}