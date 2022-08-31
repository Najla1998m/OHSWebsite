using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class VendorRatingDto
    {
        public int Id { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        public string UserId { get; set; }
        public int CompanyId { get; set; }
         public CompanyDto Company { get; set; }
    }
}