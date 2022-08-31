using API.DTOs;
using API.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping
{
    
        public class Attachments_AttachmentsDtoProfile : Profile
        {
            public Attachments_AttachmentsDtoProfile()
            {
                CreateMap<Attachment, AttachmentDto>()
                    .ReverseMap();

            }
        }
    
}
