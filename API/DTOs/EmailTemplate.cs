using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    class EmailTemplate
    {
        [JsonProperty("UserFullName")]
        public string UserFullName { get; set; }

        [JsonProperty("NewPassword")]
        public string NewPassword { get; set; }
        [JsonProperty("LoginURL")]
        public string LoginURL { get; set; }
        [JsonProperty("Subject")]
        public string Subject { get; set; }
    }
}
