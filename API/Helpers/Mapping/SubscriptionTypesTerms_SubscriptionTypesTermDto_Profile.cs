using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class SubscriptionTypesTerms_SubscriptionTypesTermDto_Profile : Profile
    {
        public SubscriptionTypesTerms_SubscriptionTypesTermDto_Profile()
        {
            CreateMap<SubscriptionTypesTerm, SubscriptionTypesTermDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());

        }
    }
}
