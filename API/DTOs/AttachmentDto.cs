namespace API.DTOs
{
    public class AttachmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsOptional { get; set; }
        public bool IsVisible { get; set; }
    }
}