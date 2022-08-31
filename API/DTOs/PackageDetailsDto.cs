namespace API.DTOs
{
    public class PackageDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string ColumnType { get; set; }
        public int PackageId { get; set; }
        public PackageDto Package { get; set; }

    }
}