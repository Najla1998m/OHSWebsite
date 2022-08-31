using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SubscriptionTypesWithAttashments
    {
        public SubscriptionTypeDto SubscriptionTypeDto { get; set; }
        public List<AttachmentItems> AttachmentListDto { get; set; }
    }

    public class AttachmentItems
    {
        public int SubscriptionTypeAttachmentId { get; set; }
        public AttachmentDto AttachmentListDto { get; set; }
    }
}
