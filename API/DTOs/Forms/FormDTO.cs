using API.Entities.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Forms
{
    public class FormDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayNameAr { get; set; }
        public string DisplayNameEn { get; set; }
        public List<FormItemDTO> FormItems { get; set; }
        public int? DepartementId { get; set; }
        public DepartementDto Departement { get; set; }
    }
}
