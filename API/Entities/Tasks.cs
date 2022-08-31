using API.Entities.Forms;
using System;

namespace API.Entities
{
    public class Tasks
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public string CreatorId { get; set; }
        public AppUser Creator { get; set; }
        public string AssignedToId { get; set; }
        public AppUser AssignedTo { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? DepartementId { get; set; }
        public Departement Departement { get; set; }
        public int? ManagementId { get; set; }
        public Departement Management { get; set; }
        public int? TeamId { get; set; }
        public Departement Team { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
        public int? TasksLevelId { get; set; }
        public TasksLevel TasksLevel { get; set; }
        public int? TasksStatusId { get; set; }
        public TasksStatus TasksStatus { get; set; }
        public int? CompanyId { get; set; }
        public Company Company { get; set; }
        public string ExtraFields { get; set; }
        //
        public int? NotificationTypeId { get; set; }
        public NotificationType NotificationType { get; set; }
        public int? FormId { get; set; }
        public Form Form { get; set; }
        public string TaskLocation { get; set; }
        public string TargetTime { get; set; }
        public DateTime? TargetDate { get; set; }

    }
}