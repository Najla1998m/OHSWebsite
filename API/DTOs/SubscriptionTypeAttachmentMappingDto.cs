namespace API.DTOs
{
    public class SubscriptionTypeAttachmentMappingDto
    {
        public int Id { get; set; }
        public int SubscriptionTypeId { get; set; }
        public SubscriptionTypeDto SubscriptionType { get; set; }
        public int AttachmentId { get; set; }
        public AttachmentDto Attachment { get; set; }
    }
}