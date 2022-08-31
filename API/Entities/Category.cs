using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
        public bool ForContact { get; set; }
        public bool ForOrders { get; set; }
        public int DepartementId { get; set; }
        public Departement Departement { get; set; }
        public int? ParentID { get; set; }
        [ForeignKey("ParentID")]
        public virtual List<Category> SubCategories { get; set; }
    }
}