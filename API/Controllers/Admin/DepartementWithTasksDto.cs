using API.DTOs;

namespace API.Controllers.Admin
{
    public class DepartementWithTasksDto
    {
        public DepartementDto Departement { get; set; }
        public TasksCountDto TasksCount { get; set; }
    }
}