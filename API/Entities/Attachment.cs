namespace API.Entities
{
    public class Attachment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsOptional { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}