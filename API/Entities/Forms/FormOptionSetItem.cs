using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Forms
{
    public class FormOptionSetItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ValueAR { get; set; }
        public string ValueEN { get; set; }
        public int? FormOptionSetId { get; set; }
        public FormOptionSet FormOptionSet { get; set; }
        //public bool IsDeleted { get; set; }
    }
}
