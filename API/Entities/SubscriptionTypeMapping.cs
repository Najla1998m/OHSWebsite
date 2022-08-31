namespace API.Entities
{
    public class SubscriptionTypeAttachmentMapping
    {
        public int Id { get; set; }
        public int SubscriptionTypeId { get; set; }
        public SubscriptionType SubscriptionType { get; set; }
        public int AttachmentId { get; set; }
        public Attachment Attachment { get; set; }
    }
}