using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Forms
{
    public class Form
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayNameAr { get; set; }
        public string DisplayNameEn { get; set; }
        public int? DepartementId { get; set; }
        public Departement Departement { get; set; }
        public ICollection<FormItem> FormItems { get; set; }
        //public bool IsDeleted { get; set; }
    }
}
