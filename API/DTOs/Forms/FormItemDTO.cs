using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Forms
{
    public class FormItemDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayNameAr { get; set; }
        public string DisplayNameEn { get; set; }
        public string DefaultValue { get; set; }
        public string Value { get; set; }
        public int? FormOptionSetId { get; set; }
        public FormOptionSetDTO FormOptionSet { get; set; }
        public int? FormItemTypeId { get; set; }
        public FormItemTypeDTO FormItemType { get; set; }
        public int? FormId { get; set; }
        public FormDTO Form { get; set; }
    }
}
