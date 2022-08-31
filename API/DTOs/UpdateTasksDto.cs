namespace API.DTOs
{
    public class UpdateTasksDto
    {
        public int Id { get; set; }
        public string AssignedToId { get; set; }
        public string Description { get; set; }
        public int TasksStatusId { get; set; }
        public int CompanyId { get; set; }
        public int TasksLevelId { get; set; }
        public string ExtraFields { get; set; }
        public int? ManagementId { get; set; }
        public int? TeamId { get; set; }
        public int? DepartementId { get; set; }
    }
}