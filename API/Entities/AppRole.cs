using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppRole : IdentityRole
    {
        public bool IsDeleted { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public string ParentId { get; set; }
        public string NameAR { get; set; }
    }
}