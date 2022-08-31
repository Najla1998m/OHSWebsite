namespace API.Entities
{
    public class QuestionsPage
    {
        public int Id { get; set; }
        public string Question  { get; set; }
        public string Answer  { get; set; }
       public string QuestionType { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}