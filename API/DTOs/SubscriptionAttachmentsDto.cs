using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SubscriptionAttachmentsDto
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string ImageUrl{ get; set; }
        public int SubscriptionTypeAttachmentMappingId { get; set; }
    }
}
