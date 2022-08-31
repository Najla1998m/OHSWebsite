using System.Collections.Generic;

namespace API.DTOs
{
    public class VendorRegisterDto
    {
        public int? SubscriptionTypeId { get; set; }
        public CompanyDto CompanyDto { get; set; }
       // public List<SubscriptionTypeAttachmentDto> SubscriptionTypeAttachmentDtos { get; set; }
        public List<int> SkillIdList { get; set; }
      //  public string FullName { get; set; }
    }
}