using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterAnonymousDto
    {
        [EmailAddress]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int? SubscriptionTypeId { get; set; }
        public int CompanyId { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public int DepartementId { get; set; }
    }
}
