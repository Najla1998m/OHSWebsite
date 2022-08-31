namespace API.DTOs
{
    public class UserDetailsSkillsDto
    {
        public int Id { get; set; }
        public int SkillId { get; set; }
        public SkillDto Skill { get; set; }
    }
}