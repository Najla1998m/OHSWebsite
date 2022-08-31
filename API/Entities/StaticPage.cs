using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class StaticPage
    {
        public int Id { get; set; }
        public string Title { get; set; }
        [MaxLength]
        public string MinDescription { get; set; }
        [MaxLength]
        public string MaxDescription { get; set; }
        public int Order { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
        [MaxLength]
        public string Image { get; set; }
    }
}