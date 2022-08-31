using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SubscriptionTypesTermDto
    {
        public int Id { get; set; }
        public int SubscriptionTypeId { get; set; }
        public SubscriptionTypeDto SubscriptionType { get; set; }
        public string TermsContent { get; set; }
     
    }
}
