namespace API.Entities
{
    public class SmtpSettings
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string SupportSenderEmail { get; set; }
        public string SupportPassword { get; set; }
        public string SupportSenderName { get; set; }
        public string SendGridApiKey { get; set; }
        public string TemplateId { get; set; }
        public string TemplateIdSendReplyMail { get; set; }
        public string TemplateIdSendCustomerCareMail { get; set; }
        public string TemplateIdReplyMail { get; set; }
        public string TemplateIdCreatedTask { get; set; }
        public string TemplateIdActivaUser { get; set; }
        public string DeleteSubscriptionTypeAttachmentList { get; set; }
    }
}