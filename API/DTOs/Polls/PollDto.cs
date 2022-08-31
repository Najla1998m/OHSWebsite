using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Polls
{
    public class PollDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int TotalEmployees { get; set; }
        public int? CompanyId { get; set; }
        public CompanyDto Company { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<PollItemDto> PollItems { get; set; }
        public ICollection<PollDetailDto> PollDetails { get; set; }
        public ICollection<PollItemActionDto> PollItemAction { get; set; }
        public ICollection<PollApprovalDto> PollApproval { get; set; }
    }
}