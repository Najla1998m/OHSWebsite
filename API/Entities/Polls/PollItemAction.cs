using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.Polls
{
    public class PollItemAction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? PollItemId { get; set; }
        public PollItem PollItem { get; set; }
        public int Priority { get; set; }
        public int Effect { get; set; }
        public int? TaskLevelId { get; set; }
        public TasksLevel TasksLevel { get; set; }
        public int? TasksId { get; set; }
        public Tasks Tasks { get; set; }
        public int? OrderId { get; set; }
        public Order Order { get; set; }
        public DateTime Date { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
        public Poll Poll { get; set; }
        public int PollId { get; set; }
    }
}
//PollItemActions => Id , Name , PollItemId ,
//Priority , Effect , TaskLevelId , TaskId , OrderId , Date , IsVisible