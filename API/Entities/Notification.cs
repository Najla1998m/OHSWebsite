using System;
using API.Entities.Polls;

namespace API.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsRead { get; set; }
        public bool IsDeleted { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public string RelatedUserId { get; set; }
        public AppUser RelatedUser { get; set; }
        public int NotificationTypeId { get; set; }
        public NotificationType NotificationType { get; set; }
        public int? TasksId { get; set; }
        public Tasks Tasks { get; set; }
        public int? PollId { get; set; }
        public Poll Poll { get; set; }
    }
}