using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Polls
{
    public class PollApproval
    {
        public int Id { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public int? PollItemId { get; set; }
        public PollItem PollItem { get; set; }
        public bool? ActionTaken { get; set; }
        public DateTime Date { get; set; }
        public bool IsDeleted { get; set; }
        public Poll Poll { get; set; }
        public int PollId { get; set; }
    }
}
//  PollApprovals => Id , UserId , PollItemId , ActionTaken , Date , IsDeleted
