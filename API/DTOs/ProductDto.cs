namespace API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string ImageName { get; set; }
        public string Type { get; set; }
        public bool IsVisible { get; set; }
        public int CategoryId { get; set; }
        public int Quantity { get; set; }
        public CategoryDto Category { get; set; }
    }
}