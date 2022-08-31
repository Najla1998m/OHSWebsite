using Newtonsoft.Json;

namespace API.DTOs
{
    public class EmailTemplateForSendingReplyDto
    {
        [JsonProperty("UserFullName")]
        public string UserFullName { get; set; }

        [JsonProperty("Reply")]
        public string Reply { get; set; }
        [JsonProperty("WebsiteURL")]
        public string WebsiteURL { get; set; }
        [JsonProperty("Mobile")]
        public string Mobile { get; set; }
        [JsonProperty("Email")]
        public string Email { get; set; }
        [JsonProperty("Message")]
        public string Message { get; set; }
    }
}