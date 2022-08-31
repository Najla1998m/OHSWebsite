using System.ComponentModel.DataAnnotations;
namespace API.Entities
{
    public class SliderImage
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string AltHeadline { get; set; }
        public string AltBody { get; set; }
        [StringLength(500)]
        public string Url { get; set; }
         public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}