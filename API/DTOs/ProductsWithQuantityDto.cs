namespace API.DTOs
{
    public class ProductsWithQuantityDto
    {
        public ProductDto Product { get; set; }
        public int Quantity { get; set; }
    }
}