using API.Enums;

namespace API.DTOs
{
    public class ResponseDto<T>
    {
        // public HttpStatusCodeEnum Status { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }
    }
}