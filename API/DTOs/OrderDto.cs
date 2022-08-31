using System;

namespace API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public AppUserDto Owner { get; set; }
        public string AssignedUserId { get; set; }
         public AppUserDto AssignedUser { get; set; }
        public int CategoryId { get; set; }
        // public CategoryDto Category { get; set; }
        public string Body { get; set; }
        public DateTime Date { get; set; }
        public string VendorId { get; set; }
        // public AppUserDto Vendor { get; set; }
        public bool IsClosed { get; set; }
        public bool IsDeleted { get; set; }
        public string OrderTitle { get; set; }
        public DateTime OrderStartDate { get; set; }
        public int? TasksStatusId { get; set; }
        //public TasksStatus OrderStatus { get; set; }
        public double OrderRequiredHours { get; set; }

    }
}