namespace API.DTOs
{
    public class AttachmentsUploadedDto<T>
    {
        public string Message { get; set; }
        public T Value { get; set; }
    }
}