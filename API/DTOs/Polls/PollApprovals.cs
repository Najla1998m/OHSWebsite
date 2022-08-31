using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Polls
{
    public class PollApprovalDto
    {
        public int Id { get; set; }
        public string AppUserId { get; set; }
        //  public AppUserDto AppUser { get; set; }
        public int? PollItemId { get; set; }
        //   public PollItemDto PollItem { get; set; }
        public bool? ActionTaken { get; set; }
        public DateTime Date { get; set; }
        //    public bool IsDeleted { get; set; }
        // public PollDto Poll { get; set; }
        public int PollId { get; set; }
    }

}