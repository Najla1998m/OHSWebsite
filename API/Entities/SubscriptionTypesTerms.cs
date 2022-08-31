using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SubscriptionTypesTerm
    {
        public int Id { get; set; }
        public int SubscriptionTypeId { get; set; }
        public SubscriptionType SubscriptionType { get; set; }
        public string TermsContent { get; set; }
        public bool IsDeleted { get; set; }

    }
}
