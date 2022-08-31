namespace API.DTOs
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int Order { get; set; }
        public bool IsVisible { get; set; }
        public string ImageName { get; set; }
    }
}