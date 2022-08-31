﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class TasksAttachment
    {
        //Id - TaskId - SubscriptionTypeAttachmentId - ImageURL
        public int Id { get; set; }
        public int? TaskId { get; set; }
        public Tasks Tasks { get; set; }
        public int? SubscriptionTypeAttachmentId { get; set; }
        public SubscriptionTypeAttachment SubscriptionTypeAttachment { get; set; }
        public string ImageURL { get; set; }
    }
}
