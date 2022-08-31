using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class VendorRating
    {
        public int Id { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        public bool IsDeleted { get; set; }
    }
}