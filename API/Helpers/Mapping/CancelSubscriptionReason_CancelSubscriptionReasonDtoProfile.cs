using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class CancelSubscriptionReason_CancelSubscriptionReasonDtoProfile : Profile
    {
        public CancelSubscriptionReason_CancelSubscriptionReasonDtoProfile()
        {
            CreateMap<CancelSubscriptionReason, CancelSubscriptionReasonDto>()
                .ReverseMap()
                .ForMember(m => m.Id, opt => opt.Ignore());

        }
    }
}