using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class StaticPageDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        [StringLength(250)]
        public string MinDescription { get; set; }
        public string MaxDescription { get; set; }
        public int Order { get; set; }
        public bool IsVisible { get; set; }
        public string Image { get; set; }
        public string ImageName { get; set; }
    }
}