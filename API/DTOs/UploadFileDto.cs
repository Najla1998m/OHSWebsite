using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UploadFileDto
    {
        public string UserId { get; set; }
        public string ImageName { get; set; }
        public string ImageBase { get; set; }
    }
}
