using System.Collections;
using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
    public class UserSkillsAndRatingsDto
    {
        public AppUser AppUser { get; set; }
        public IEnumerable<VendorRating> VendorRatings { get; set; }
        public IEnumerable<VendorSkill> VendorSkills { get; set; }
    }
}