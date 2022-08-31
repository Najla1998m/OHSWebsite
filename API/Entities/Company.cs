namespace API.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public string Logo { get; set; }
        public int EmployeesNumbers { get; set; }
        public string Website { get; set; }
        public string MapUrl { get; set; }
        public string City { get; set; }
    }
}