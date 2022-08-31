using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class SliderImageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string ImageName { get; set; }
        public string AltHeadline { get; set; }
        public string AltBody { get; set; }
        [StringLength(500)]
        public string Url { get; set; }
         public bool IsVisible { get; set; }
    }
}