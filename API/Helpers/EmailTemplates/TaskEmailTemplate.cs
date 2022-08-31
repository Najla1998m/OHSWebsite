using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.EmailTemplates
{
    public class TaskEmailTemplate : SendGridEmailTemplate
    {
        [JsonProperty("TaskNumber")]
        public string TaskNumber { get; set; }
    }
}
