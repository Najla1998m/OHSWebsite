namespace API.DTOs
{
    public class OfferDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public int CategoryId { get; set; }
        public string Image { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int ProductQuantity { get; set; }
        public decimal HourPrice { get; set; }
        public decimal Price { get; set; }
        public int OfferStatusId { get; set; }
        public bool IsVisible { get; set; }
    }
}