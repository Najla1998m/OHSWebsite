using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Helpers
{
    public class PagingSortingFilteringList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public PagingSortingFilteringList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public static async Task<PagingSortingFiltering<T>> CreateAsync(IQueryable<T> source,  PagingParams pagingParams)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pagingParams.PageNumber - 1) * pagingParams.PageSize)
                                    .Take(pagingParams.PageSize)
                                    .ToListAsync();

            if (items == null) throw new Exception("Not Found");

            // var deserializedString = JsonConvert.DeserializeObject<string>(sortingParams.SortBy);

            // if (!string.IsNullOrEmpty(deserializedString) && sortingParams.Order == 1)
            //     items = items.OrderBy(s => GetPropertyValue(s, deserializedString)).ToList();

            // if (!string.IsNullOrEmpty(deserializedString) && sortingParams.Order == -1)
            //     items = items.OrderByDescending(s => GetPropertyValue(s, deserializedString)).ToList();

            //searchBy = JsonConvert.DeserializeObject<string>(searchBy);

            // if (!string.IsNullOrEmpty(searchBy))
            //     items = items
            //             .Where(s => GetPropertyValue(s, "Username").ToString().Contains(searchBy)
            //             || GetPropertyValue(s, "Email").ToString().Contains(searchBy)).ToList();

            var result = new PagedList<T>(items, count, pagingParams.PageNumber, pagingParams.PageSize);

            return new PagingSortingFiltering<T>()
            {
                Items = result,
                TotalPages = result.TotalPages,
                TotalItems = result.TotalCount,
                ItemsPerPage = result.PageSize,
                CurrentPage = result.CurrentPage
            };
        }
        private static object GetPropertyValue(T obj, string property)
        {
            System.Reflection.PropertyInfo propertyInfo = obj.GetType().GetProperty(property);
            return propertyInfo.GetValue(obj, null);
        }
    }
}