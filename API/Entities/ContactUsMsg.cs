using System;
namespace API.Entities
{
    public class ContactUsMsg
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Message { get; set; }
        public DateTime MessageDate { get; set; }
        public bool IsDeleted { get; set; }
        // public int CategoryId { get; set; }
        // public Category Category { get; set; }

    }
}