using API.Data;
using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public interface ITasksManager
    {
        Task<Tasks> AddCustomerCareTask(DataContext context,string userId);
    }
}
