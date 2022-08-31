using System.Collections.Generic;

namespace API.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsVisible { get; set; }
        // public bool IsDeleted { get; set; }
        public bool ForContact { get; set; }
        public bool ForOrders { get; set; }
        public int DepartementId { get; set; }
        public DepartementDto Departement { get; set; }
        public int? ParentID { get; set; }
        // public List<CategoryDto> SubCategories { get; set; }
    }
}