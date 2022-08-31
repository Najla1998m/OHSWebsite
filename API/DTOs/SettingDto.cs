namespace API.DTOs
{
    public class SettingDto
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public string SettingType { get; set; }
        public bool IsVisible { get; set; }
    }
}