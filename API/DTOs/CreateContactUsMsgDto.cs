namespace API.DTOs
{
    public class CreateContactUsMsgDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Message { get; set; }
        // public int CategoryId { get; set; }
    }
}