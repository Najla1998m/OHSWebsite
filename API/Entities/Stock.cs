namespace API.Entities
{
    public class Stock
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public bool IsDeleted { get; set; }
    }
}