using System.Collections.Generic;
using API.Controllers.Admin;

namespace API.DTOs
{
    public class TaskDashboardStatisticsForAdminDto
    {
        public DepartementsCountDto DepartementsCount { get; set; }
        public List<ManagementsWithDepartementsDto> DepartementsWithTasksCount { get; set; }
        public TasksCountDto TasksCount { get; set; }
        public TasksCountDto TasksCountForPreviousMonth { get; set; }
        public int OrdersCount { get; set; }

        public List<TasksLevelDto> TasksLevel { get; set; }
        public List<DepartementDto> Managements { get; set; }
    }
}