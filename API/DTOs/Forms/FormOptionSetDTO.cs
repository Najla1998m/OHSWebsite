using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Forms
{
    public class FormOptionSetDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayNameAr { get; set; }
        public string DisplayNameEn { get; set; }
        public string DefaultValue { get; set; }
        public List<FormOptionSetItemDTO> FormOptionSetItems { get; set; }
    }
}
