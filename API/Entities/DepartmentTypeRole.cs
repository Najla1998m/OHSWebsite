using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class DepartmentTypeRole
    {
        public int Id { get; set; }
        public string DepartmentType { get; set; }
        public string AppRoleId { get; set; }
        public AppRole AppRole { get; set; }
        public bool IsDeleted { get; set; }
    }
}
