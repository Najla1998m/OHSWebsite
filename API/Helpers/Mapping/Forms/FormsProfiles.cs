using API.DTOs.Forms;
using API.Entities.Forms;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping.Forms
{
    public class FormsProfiles
    {
    }
    
    public class FormsProfilesFormDTO:Profile
    {
        public FormsProfilesFormDTO()
        {
            CreateMap<Form, FormDTO>().ReverseMap();
        }
    }

    public class FormsItemProfilesFormItemDTO : Profile
    {
        public FormsItemProfilesFormItemDTO()
        {
            CreateMap<FormItem, FormItemDTO>().ReverseMap();
        }
    }
    public class FormsItemTypeProfilesFormItemTypeDTO : Profile
    {
        public FormsItemTypeProfilesFormItemTypeDTO()
        {
            CreateMap<FormItemType, FormItemTypeDTO>().ReverseMap();
        }
    }
    public class FormsOptinSetProfilesFormoptinSetDTO : Profile
    {
        public FormsOptinSetProfilesFormoptinSetDTO()
        {
            CreateMap<FormOptionSet, FormOptionSetDTO>().ReverseMap();
        }
    }

    public class FormsOptinSetItemProfilesFormoptinSetItemDTO : Profile
    {
        public FormsOptinSetItemProfilesFormoptinSetItemDTO()
        {
            CreateMap<FormOptionSetItem, FormOptionSetItemDTO>().ReverseMap();
        }
    }
}
