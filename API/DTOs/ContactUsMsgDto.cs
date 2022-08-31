using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ContactUsMsgDto
    {

        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Message { get; set; }
        public string MessageDate { get; set; }
        //public bool IsDeleted { get; set; }
        public int CategoryId { get; set; }
        //public Category Category { get; set; }


    }
}
