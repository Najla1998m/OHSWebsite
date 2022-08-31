namespace API.Entities
{
    public class 
    StockProducts
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        // public string UserId { get; set; }
        // public AppUser User { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public bool IsDeleted { get; set; }
    }
}