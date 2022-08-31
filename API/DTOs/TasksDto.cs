using API.Entities;
using API.Entities.Forms;
using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class TasksDto
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string CreatorId { get; set; }
        public AppUserDto Creator { get; set; }
        public string AssignedToId { get; set; }
    public AppUserDto AssignedTo { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? DepartementId { get; set; }
        public DepartementDto Departement { get; set; }
        public string Description { get; set; }

        public int TasksLevelId { get; set; }
        public TasksLevelDto TasksLevel { get; set; }
        public int TasksStatusId { get; set; }
        public TasksStatusDto TasksStatus { get; set; }
        public int CompanyId { get; set; }
        public CompanyDto Company { get; set; }
        public string ExtraFields { get; set; }
        public int? NotificationTypeId { get; set; }
        public List<TasksAttachmentDTO> TasksAttachments { get; set; }
        public List<SubscriptionTypeAttachment> SubscriptionAttachments { get; set; }
        //public NotificationType NotificationType { get; set; }

        public int? FormId { get; set; }
        //public FormDTO Form { get; set; }
        public string TaskLocation { get; set; }
        public int? ManagementId { get; set; }
        public int? TeamId { get; set; }
        public string TargetTime { get; set; }
        public DateTime? TargetDate { get; set; }

    }
}