using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Polls
{
    public class Poll
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int TotalEmployees { get; set; }
        public int? CompanyId { get; set; }
        public Company Company { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<PollItem> PollItems { get; set; }
        public ICollection<PollDetail> PollDetails { get; set; }
        public ICollection<PollItemAction> PollItemAction { get; set; }
        public ICollection<PollApproval> PollApproval { get; set; }
        
    }
}