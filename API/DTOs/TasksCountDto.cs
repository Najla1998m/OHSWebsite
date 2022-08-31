namespace API.DTOs
{
    public class TasksCountDto
    {
        public int NewTasksCount { get; set; }
        public int InProgressTasksCount { get; set; }
        public int FinishedTasksCount { get; set; }
    }
}