namespace API.Entities
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int Order { get; set; }
        
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}