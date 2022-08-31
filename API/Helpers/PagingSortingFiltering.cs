using System.Collections.Generic;

namespace API.Helpers
{
    public class PagingSortingFiltering<T>
    {
         public List<T> Items { get; set; }
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}