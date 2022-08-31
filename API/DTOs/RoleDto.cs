using System.ComponentModel.DataAnnotations;
namespace API.DTOs
{
    public class RoleDto
    {
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string ParentId { get; set; }
        public string NameAR { get; set; }
    }
}