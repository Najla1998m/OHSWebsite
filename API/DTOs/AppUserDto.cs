using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using API.Entities;

namespace API.DTOs
{
    public class AppUserDto
    {
        public string Id { get; set; }
        public bool IsActive { get; set; }
        // public bool IsDeleted { get; set; }

        [Required]
        [EmailAddress]
        [DataType(DataType.Password)]
        public string Email { get; set; }
        [Required]
        public string Username { get; set; }
       // [Required]
        public string Password { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public CompanyDto Company { get; set; }
        public List<UserRolesDto> UserRoles { get; set; }
        public List<UserDepartmentsDto> UserDepartments { get; set; }
        public DepartementDto DepartementDto { get; set; }

        public bool AllAttachmentsUploaded { get; set; }

        public bool IsTeamManager { get; set; }

        public bool IsVerified { get; set; }
        public string UserPhoto { get; set; }
        public string DisplayName { get; set; }
        // public List<AppUserRoleDto> UserRolesDto { get; set; }
    }
}