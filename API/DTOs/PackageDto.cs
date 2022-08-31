using System.Collections.Generic;

namespace API.DTOs
{
    public class PackageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public bool IsVisible { get; set; }
        public bool ForVendors { get; set; }
        public bool ForClients { get; set; }
        public int EmployeesNumbers { get; set; }
        public int Duration { get; set; }
        public int AllowedDays { get; set; }
        public decimal PricePerEmployee { get; set; }
        public List<PackageDetailsDto> PackageDetails { get; set; }
    }
}