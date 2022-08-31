namespace API.DTOs
{
    public class StockProductsDto
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public StockDto Stock { get; set; }
        // public string UserId { get; set; }
        // public AppUserDto User { get; set; }
        public int ProductId { get; set; }
        public ProductDto Product { get; set; }
        public int Quantity { get; set; }
    }
}