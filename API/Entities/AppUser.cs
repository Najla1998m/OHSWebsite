using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser
    {
        public string JobTitle { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
        public int? PackageId { get; set; }
        public Package Package { get; set; }
        public int? SubscriptionTypeId { get; set; }
        public SubscriptionType SubscriptionType { get; set; }
        public bool IsEmployeeExpired { get; set; }
        public bool IsDateExpired { get; set; }
        public DateTime ChargeDate { get; set; }
        public int Duration { get; set; }
        public int EmployeesNumbers { get; set; }
        public int PackageAllowedDays { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        // public int? DepartementId { get; set; }
        // public Departement Departement { get; set; }
        public int CompanyId { get; set; }
        public string FullName { get; set; }
        public Company Company { get; set; }
        public bool IsTeamManager { get; set; }
        public ICollection<UserDepartments> UserDepartments { get; set; }
        public string UserPhoto { get; set; }
        
    }
}