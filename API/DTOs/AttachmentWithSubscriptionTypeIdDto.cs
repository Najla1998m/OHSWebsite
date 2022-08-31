using System.Collections.Generic;

namespace API.DTOs
{
    public class AttachmentWithSubscriptionTypeIdDto
    {
        public int SubscriptionTypeId { get; set; }
        public int SubscriptionTypeAttachmentMappingId { get; set; }
        public AttachmentDto Attachment { get; set; }
    }
}