using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Forms
{
    public class FormOptionSet
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayNameAr { get; set; }
        public string DisplayNameEn { get; set; }
        public string DefaultValue { get; set; }
        public ICollection<FormOptionSetItem> FormOptionSetItems { get; set; }
        //public bool IsDeleted { get; set; }
    }
}
