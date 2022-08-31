using System.Collections.Generic;

namespace API.DTOs
{
    public class DepartementDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ParentId { get; set; }
        public virtual List<DepartementDto> SubDepartements { get; set; }
        public int? CorrespondingDeptId { get; set; }
        public string UnitType { get; set; }
        public string DepartementLocation { get; set; }
        public int CompanyId { get; set; }
        public int DeptsNumber { get; set; }
        public CompanyDto Company { get; set; }
        public List<UserDepartmentsDto> UserDepartments { get; set; }

        public TasksCountDto TasksCounts { get; set; }
        public int TasksCount { get; set; }
      
    }
}