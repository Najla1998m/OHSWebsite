using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public AppUser Owner { get; set; }
        public string AssignedUserId { get; set; }
        public AppUser AssignedUser { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string Body { get; set; }
        public DateTime Date { get; set; }
        public string VendorId { get; set; }
        public AppUser Vendor { get; set; }
        // public List<Offer> Offers { get; set; }
        public bool IsClosed { get; set; } 
        public bool IsDeleted { get; set; }
        public string OrderTitle { get; set; }
        public DateTime OrderStartDate { get; set; }
        public int? TasksStatusId { get; set; }
        public TasksStatus TasksStatus { get; set; }
        public double OrderRequiredHours { get; set; }
    }
}