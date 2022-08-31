using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class AdminDashbordDto
    {
        public int CompanyCount { get; set; }
        public int EmployeeCount { get; set; }
        public int VendorCount { get; set; }
        public int NotesCount { get; set; }
        public int TrainingCount { get; set; }
    }
}
