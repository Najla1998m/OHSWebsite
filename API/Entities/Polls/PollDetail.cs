using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Polls
{
    public class PollDetail
    {
        public int Id { get; set; }

        public int? PollItemId { get; set; }
        public PollItem PollItem { get; set; }
        public int? PollId { get; set; }
        public Poll Poll { get; set; }
        public bool? PollItemValue { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public DateTime Date { get; set; }
        public bool IsDeleted { get; set; }
    }
}
//PollDetails => Id , PollItemId , PollItemValue(True / False) , UserId , Date , IsDeleted