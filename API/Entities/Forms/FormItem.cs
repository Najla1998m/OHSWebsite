using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Forms
{
    public class FormItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayNameAr { get; set; }
        public string DisplayNameEn { get; set; }
        public string DefaultValue { get; set; }
        public string Value { get; set; }
        public int? FormOptionSetId { get; set; }
        public FormOptionSet FormOptionSet { get; set; }
        public int? FormItemTypeId { get; set; }
        public FormItemType FormItemType { get; set; }
        public int? FormId { get; set; }
        public Form Form { get; set; }
        //public bool IsDeleted { get; set; }
    }
}
