using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.EmailTemplates
{
    public class ActivateUserTemplate : SendGridEmailTemplate
    {
        [JsonProperty("UserFullName")]
        public string UserFullName { get; set; }
        [JsonProperty("DeptName")]
        public string DeptName { get; set; }
        [JsonProperty("LoginURL")]
        public string LoginURL { get; set; }

    }
}
