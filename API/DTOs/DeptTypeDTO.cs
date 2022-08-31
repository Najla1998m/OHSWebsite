using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class DeptTypeDTO
    {
        public string DeptType { get; set; }
        public List<string> RoleIds { get; set; }
    }
}
