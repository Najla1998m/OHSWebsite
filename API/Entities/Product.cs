namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public decimal UnitPrice { get; set; }
        public string Insurance { get; set; }
        public decimal Tax { get; set; }
        public decimal DeliveryPrice { get; set; }
        public decimal FinalPrice { get; set; }
        public string Image { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}