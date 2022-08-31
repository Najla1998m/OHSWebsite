using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class OfferStatus_OfferStatusDtoProfile : Profile
    {
        public OfferStatus_OfferStatusDtoProfile()
        {
            CreateMap<OfferStatus, OfferStatusDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}