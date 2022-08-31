using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SubscriptionTypeAttachementDto
    {
        public int SubscriptionTypeId { get; set; }
        public string Name { get; set; }
        public bool IsOptional { get; set; }
        public bool IsVisible { get; set; }
    }
}
