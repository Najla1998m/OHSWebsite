namespace API.Entities
{
    public class Setting
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public string SettingType { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
    }
}