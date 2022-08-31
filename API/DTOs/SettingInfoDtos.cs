using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SettingInfoDtos
    {
        public string Email { get; set; }
        public string MapUrl { get; set; }
        public string VideoURL { get; set; }
        public string MainBrief { get; set; }
        public string MainHeadline { get; set; }
        public List<string> SliderImagesList { get; set; }
        public List<string> SliderTextList { get; set; }
        public string CompanyPhone { get; set; }
        public string ClientsNumLbl { get; set; }
        public string VendorsNumLbl { get; set; }
        public string TasksNumLbl { get; set; }
        public string CoursesNumLbl { get; set; }
        public string MainSliderHeader { get; set; }
    }
}
