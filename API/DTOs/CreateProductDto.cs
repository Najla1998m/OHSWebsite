namespace API.DTOs
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public string ImageName { get; set; }
        public string Type { get; set; }
        public bool IsVisible { get; set; }
        public int CategoryId { get; set; }
    }
}