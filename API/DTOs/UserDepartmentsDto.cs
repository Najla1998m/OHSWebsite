using API.Entities;

namespace API.DTOs
{
    public class UserDepartmentsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public AppUserDto User { get; set; }
        // [Key]
        public int DepartementId { get; set; }
        public DepartementDto Departement { get; set; }
        public int? CorrespondingDeptId { get; set; }
    }
}