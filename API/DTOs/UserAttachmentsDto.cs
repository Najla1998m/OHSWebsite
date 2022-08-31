using System.Collections.Generic;

namespace API.DTOs
{
    public class UserAttachmentsDto
    {

        public AppUserDto User { get; set; }
        // public List<AttachmentDto> Attachments { get; set; }
        public List<AttachmentWithSubscriptionTypeIdDto> AttachmentWithSubscriptionTypeId { get; set; }
        public List<VendorRatingDto> VendorRatings { get; set; }
        public List<UserDetailsSkillsDto> VendorSkills { get; set; }
        public string QrImage { get; set; }
        public DepartementDto Departement { get; set; }
        // public int SubscriptionTypeId { get; set; }
    }
}