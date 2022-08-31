using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class SubscriptionType_SubscriptionTypeDtoProfile:Profile
    {
        public SubscriptionType_SubscriptionTypeDtoProfile()
        {
            CreateMap<SubscriptionType, SubscriptionTypeDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}