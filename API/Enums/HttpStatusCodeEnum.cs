using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Enums
{
    public enum HttpStatusCodeEnum
    {
        Ok = 200,
        NotFound = 404,
        Ambiguous = 300,
        IneternalServerError = 500,
        NotAllowed = 405
    }
}
