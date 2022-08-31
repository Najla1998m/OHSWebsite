using System.Collections.Generic;

namespace API.Entities
{
    public class Package
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
        public bool ForVendors { get; set; }
        public bool ForClients { get; set; }
        public int EmployeesNumbers { get; set; }
        public int Duration { get; set; }
        public int AllowedDays { get; set; }
        public decimal PricePerEmployee { get; set; }
        public ICollection<PackageDetails> PackageDetails { get; set; }
    }
}