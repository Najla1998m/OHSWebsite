using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Forms
{
    public class FormItemType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DefaultValue { get; set; }
        public string Roles { get; set; }
        //public bool IsDeleted { get; set; }
    }
}
