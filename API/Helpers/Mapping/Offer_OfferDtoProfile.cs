using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Offer_OfferDtoProfile:Profile
    {
        public Offer_OfferDtoProfile()
        {
             CreateMap<Offer, OfferDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}