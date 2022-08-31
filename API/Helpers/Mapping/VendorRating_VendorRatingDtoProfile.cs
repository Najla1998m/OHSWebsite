using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class VendorRating_VendorRatingDtoProfile:Profile
    {
        public VendorRating_VendorRatingDtoProfile()
        {
               CreateMap<VendorRating, VendorRatingDto>()
             .ReverseMap()
             .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}