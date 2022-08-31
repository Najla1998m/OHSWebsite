namespace API.Entities
{
    public class VendorSkill
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
        public bool IsDeleted { get; set; }
    }
}