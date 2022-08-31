namespace API.DTOs
{
    public class VendorSkillDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public AppUserDto User { get; set; }
        public int SkillId { get; set; }
        public SkillDto Skill { get; set; }
    }
}