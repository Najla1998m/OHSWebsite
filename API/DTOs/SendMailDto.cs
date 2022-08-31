namespace API.DTOs
{
    public class SendMailDto
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string Name { get; set; }
    }
}