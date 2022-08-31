namespace API.Entities
{
    public class Quotation
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public string VendorId { get; set; }
        public AppUser Vendor { get; set; }
        public string Details { get; set; }
        public decimal Price { get; set; }
        public int QuotationStatusId { get; set; }
        public QuotationStatus QuotationStatus { get; set; }
        public bool IsDeleted { get; set; }

    }
}