namespace API.Entities
{
    public class CancelSubscriptionReason
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}