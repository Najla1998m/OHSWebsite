using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.EmailTemplates
{
    public class RejectedAttachmentsTemplete: SendGridEmailTemplate
    {

        [JsonProperty("RejectReason")]
        public string RejectReason { get; set; }
        [JsonProperty("RejectedAttachments")]
        public string RejectedAttachments { get; set; }
    }
}
