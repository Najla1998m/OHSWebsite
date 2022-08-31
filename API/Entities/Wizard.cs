namespace API.Entities
{
    public class Wizard
    {
        public int Id { get; set; }
        public int WizardTypeId { get; set; }
        public WizardType WizardType { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsDeleted { get; set; }
    }
}