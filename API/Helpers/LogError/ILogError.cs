using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.LogError
{
    public interface ILogError
    {
        void Log(Exception ex, string MethodName, ExceptionContext context, params (string Name, object Value)[] parameters);
    }
}
