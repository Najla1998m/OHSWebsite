using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Forms
{
    public class FormItemTypeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DefaultValue { get; set; }
        public string Roles { get; set; }
    }
}
