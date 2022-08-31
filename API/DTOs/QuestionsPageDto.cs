namespace API.DTOs
{
    public class QuestionsPageDto
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string QuestionType { get; set; }
        public bool IsVisible { get; set; }
    }
}