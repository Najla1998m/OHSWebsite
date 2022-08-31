namespace API.DTOs
{
    public class SupportSendEmailDto
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Name { get; set; }
        public string Mobile { get; internal set; }
        public string Message { get; internal set; }
    }
}