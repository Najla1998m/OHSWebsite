namespace API.DTOs
{
    public class QuotationDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string VendorId { get; set; }
        public string Details { get; set; }
        public decimal Price { get; set; }
        public int QuotationStatusId { get; set; }
    }
}