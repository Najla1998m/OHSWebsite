using System.Collections.Generic;
using API.DTOs;

namespace API.Controllers.Admin
{
    public class GetTaskDashboardStatisticsForDeptManager
    {
        public GetTaskDashboardStatisticsForDeptManager()
        {
        }

        public DepartementsCountDto DepartementsCount { get; set; }
        public TasksCountDto TasksCount { get; set; }
        public int OrdersCount { get; set; }
        public List<ManagementsWithDepartementsDto> DepartementsWithTasksCount { get; set; }
        public DepartementsAndManagementWithTasksDto DepartementsWithTasksCountForDepManager { get; set; }
        public List<TasksLevelDto> TasksLevel { get; set; }
        public TasksCountDto TasksCountForPreviousMonth { get; set; }
        public int EmployeesCount { get; internal set; }
        public List<DepartementDto> Departements { get;  set; }
    }
}