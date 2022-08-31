using System.Collections.Generic;

namespace API.DTOs
{
    public class DepartementsWithTasksDto
    {
        public TasksCountDto TasksCount { get; set; }
        public DepartementDto Departements { get; set; }
    }
}