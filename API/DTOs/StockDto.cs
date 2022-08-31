namespace API.DTOs
{
    public class StockDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public AppUserDto User { get; set; }
    }
}