using System.Collections.Generic;
using API.DTOs;

namespace API.Controllers.Admin
{
    public class ManagementsWithDepartementsDto
    {
        public int Managements { get; set; }
        public List<DepartementDto> Departements { get; set; }
    }
}