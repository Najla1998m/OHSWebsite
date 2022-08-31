using System.Collections.Generic;

namespace API.DTOs
{
    public class DepartementsAndManagementWithTasksDto
    {
        public List<DepartementsWithTasksDto> DepartementsWithTasks { get; set; }
        public List<DepartementsWithTasksDto> ManagementsWithTasks { get; set; }
    }
}