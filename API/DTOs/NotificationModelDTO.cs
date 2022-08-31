using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class NotificationModelDTO
    {
        public List<NotificationDto> Notifications { get; set; }
        public int UnReadedCount { get; set; }
        public int ReadedCount { get; set; }
    }
}
