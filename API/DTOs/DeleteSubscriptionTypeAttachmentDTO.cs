using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class DeleteSubscriptionTypeAttachmentDTO
    {
        //List<int> SubscriptionTypeAttachmentList,int taskId,

        public List<int> SubscriptionTypeAttachmentList { get; set; }
        public int TaskId { get; set; }
        public string RejectReason { get; set; }
    }
}
