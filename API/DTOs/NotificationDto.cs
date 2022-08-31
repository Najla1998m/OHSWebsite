using System;
using API.DTOs.Polls;

namespace API.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string DateTime
        {
            get
            {
                return Date.Value.ToString();
            }
        }
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsRead { get; set; }
        public bool IsDeleted { get; set; }
        public string UserId { get; set; }
        public AppUserDto User { get; set; }
        public int NotificationTypeId { get; set; }
        public NotificationTypeDto NotificationType { get; set; }
        public int? TasksId { get; set; }
        public TasksDto Tasks { get; set; }
        public int? PollId { get; set; }
        public PollDto Poll { get; set; }
    }
}