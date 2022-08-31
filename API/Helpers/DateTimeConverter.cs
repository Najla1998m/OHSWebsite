using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public static class CustomDateTimeConverter
    {
        public static DateTime Timezone()
        {
            TimeZoneInfo timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Arab Standard Time");
            DateTime utc = DateTime.UtcNow;
            return TimeZoneInfo.ConvertTime(utc, timeZoneInfo);
        }
        public static DateTime Timezone(DateTime date)
        {
            TimeZoneInfo timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Arab Standard Time");
            return TimeZoneInfo.ConvertTime(date, timeZoneInfo);
        }
        public static bool IsDateBeforeOrToday(DateTime? input)
        {
            if (input.HasValue)
            {
                //Invalid date
                //log , show error
                return false;
            }
            return DateTime.Today >= input;
        }
    }
}
