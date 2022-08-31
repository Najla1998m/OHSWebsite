using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Polls
{
    public class PollItemDto
    {
        //Id , Name , PollId , IsVisible
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsVisible { get; set; }
        // public bool IsDeleted { get; set; }
        public int? PollId { get; set; }
        //public PollDto Poll { get; set; }
    }
}
