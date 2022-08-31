using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Departement // ادرات واقسام فقط
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public int? ParentId { get; set; }
        [ForeignKey("ParentId")]
        public virtual List<Departement> SubDepartements { get; set; }
        public int? CorrespondingDeptId { get; set; }
        public string UnitType { get; set; }
        public string DepartementLocation { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        public ICollection<UserDepartments> UserDepartments { get; set; }
        public int DeptsNumber { get; set; }
    }
}