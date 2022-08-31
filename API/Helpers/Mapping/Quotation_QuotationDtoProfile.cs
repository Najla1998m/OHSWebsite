using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Quotation_QuotationDtoProfile : Profile
    {
        public Quotation_QuotationDtoProfile()
        {
            CreateMap<Quotation, QuotationDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());
        }
    }
}