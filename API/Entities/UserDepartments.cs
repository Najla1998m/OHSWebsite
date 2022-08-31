using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class UserDepartments
    {

        // [Key]
        public string UserId { get; set; }
        public AppUser User { get; set; }
        // [Key]
        public int DepartementId { get; set; }
        public Departement Departement { get; set; }
    }
}