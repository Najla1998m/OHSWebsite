namespace API.Entities
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}