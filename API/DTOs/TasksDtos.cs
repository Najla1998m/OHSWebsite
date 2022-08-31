using System.Collections.Generic;

namespace API.DTOs
{
    public class TasksDtos
    {
        public List<TasksDto> InProgressTasksCount { get; set; }
        public List<TasksDto> FinishedTasksCount { get; set; }
        public List<TasksDto> NewTasksCount { get; set; }
    }
}