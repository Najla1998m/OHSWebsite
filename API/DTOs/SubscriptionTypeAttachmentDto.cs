namespace API.DTOs
{
    public class SubscriptionTypeAttachmentDto
    {
        public int Id { get; set; }
        public int SubscriptionTypeAttachmentMappingId { get; set; }
        public string ImageUrl { get; set; }
        public string UserId { get; set; }
    }
}