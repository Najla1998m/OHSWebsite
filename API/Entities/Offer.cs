namespace API.Entities
{
    public class Offer
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string Image { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductQuantity { get; set; }
        public decimal HourPrice { get; set; }
        public decimal Price { get; set; }
        public int OfferStatusId { get; set; }
        public OfferStatus OfferStatus { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}