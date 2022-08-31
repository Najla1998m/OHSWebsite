namespace API.Entities
{
    public class PackageDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string ColumnType { get; set; }
        public int PackageId { get; set; }
        public Package Package { get; set; }
        public bool IsDeleted { get; set; }
    }
}