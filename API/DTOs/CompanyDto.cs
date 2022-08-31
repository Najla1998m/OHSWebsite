namespace API.DTOs
{
    public class CompanyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public int EmployeesNumbers { get; set; }
        public string Logo { get; set; }
        public string Website { get; set; }
        public string MapUrl { get; set; }
    }
}