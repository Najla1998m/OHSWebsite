using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{
    public class QuotationStatusDto_QuotationStatusprofile : Profile
    {
        public   QuotationStatusDto_QuotationStatusprofile()
        {
                CreateMap<QuotationStatus, QuotationStatusDto>();
        }  
    }
}
