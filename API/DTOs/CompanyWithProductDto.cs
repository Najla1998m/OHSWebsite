namespace API.DTOs
{
    public class CompanyWithProductDto
    {
        public CompanyDto CompanyDto { get; set; }
        public ProductDto ProductDto { get; set; }
        public int Quantity { get; set; }
    }
}