using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class SubscriptionTypeAttachment
    {
        public int Id { get; set; }
        public int SubscriptionTypeAttachmentMappingId { get; set; }
        public SubscriptionTypeAttachmentMapping SubscriptionTypeAttachmentMapping { get; set; }
        public string ImageUrl { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public bool IsDeleted { get; set; }
    }
}