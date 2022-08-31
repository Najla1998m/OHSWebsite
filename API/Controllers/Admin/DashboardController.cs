using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers.Admin
{
    public class DashboardController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public DashboardController(DataContext context,
                                IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetTaskDashboardStatisticsForAdmin")]
        public async Task<ActionResult> GetTaskDashboardStatisticsForAdmin(string userId)
        {
            var userInDb = await _context.Users.SingleOrDefaultAsync(s => s.Id == userId);

            if (userInDb == null) return NotFound(new ResponseDto<string> { Message = "User Not Found" });

            var tasksLevels = _context.TasksLevels
                                    .Select(s => _mapper.Map<TasksLevel, TasksLevelDto>(s)).ToList();

            var dashboardData = new TaskDashboardStatisticsForAdminDto()
            {
                DepartementsCount = await GetDepartementCountByCompanyId(userInDb.CompanyId),
                TasksCount = (await GetTasksCountByCompanyId(userInDb.CompanyId)),
                OrdersCount = await GetOrdersCount(userId),
                DepartementsWithTasksCount = await GetDepartementWithTasks(userInDb.CompanyId, DepartementUnitType.Depts),
                TasksLevel = tasksLevels,
                TasksCountForPreviousMonth = await GetTasksCountForPreviousMonth(userInDb.CompanyId),
                Managements = await GetManagements(userInDb.CompanyId)
            };

            return Ok(new ResponseDto<TaskDashboardStatisticsForAdminDto> { Data = dashboardData });
        }
        [HttpGet("GetTaskDashboardStatisticsForDeptManager")]
        public async Task<ActionResult> GetTaskDashboardStatisticsForDeptManager(string userId)
        {
            var userInDb = await _context.Users
                                .Include(s => s.UserDepartments)
                                .Include(s => s.UserRoles)
                                .ThenInclude(s => s.Role)
                                .SingleOrDefaultAsync(s => s.Id == userId);

            if (userInDb == null) return NotFound(new ResponseDto<string> { Message = "User Not Found" });

            if (!userInDb.UserRoles.Any(s => s.Role.Name == "Company Departement Manager"))
                return Unauthorized(new ResponseDto<string> { Message = "User Not Company Departement Manager" });

            var departementId = userInDb.UserDepartments.FirstOrDefault().DepartementId;

            var tasksLevelByDepartmentId = (await GetTasks())
                                    .Where(s => s.ManagementId == departementId)
                                    .Select(s => s.TasksLevel).ToList();

            var dashboardData = new GetTaskDashboardStatisticsForDeptManager()
            {
                DepartementsCount = await GetDepartementCountForDeptManager(departementId),
                OrdersCount = await GetOrdersCount(userId),
                EmployeesCount = await GetEmployeesCountForDeptManager(departementId),
                TasksCount = (await GetTasksCountForDeptManager(departementId)),
                DepartementsWithTasksCountForDepManager = await GetDepartementWithTasksForDeptManager(departementId),
                TasksLevel = tasksLevelByDepartmentId,
                TasksCountForPreviousMonth = await GetDeptManagerTasksCountForPreviousMonth(departementId),
                Departements = await GetDepartements(departementId)
            };

            return Ok(new ResponseDto<GetTaskDashboardStatisticsForDeptManager> { Data = dashboardData });
        }
        [HttpGet("GetTaskDashboardStatisticsForCompSupervisor")]
        public async Task<ActionResult> GetTaskDashboardStatisticsForCompSupervisor(string userId)
        {
            var userInDb = await _context.Users
                            .Include(s => s.UserDepartments)
                            .Include(s => s.UserRoles)
                            .ThenInclude(s => s.Role)
                            .SingleOrDefaultAsync(s => s.Id == userId);

            if (userInDb == null) return NotFound(new ResponseDto<string> { Message = "User Not Found" });

            if (!userInDb.UserRoles.Any(s => s.Role.Name == "Company Supervisor"))
                return Unauthorized(new ResponseDto<string> { Message = "User Not Company Supervisor" });

            var departement = userInDb.UserDepartments.FirstOrDefault();

            if (departement == null) return NotFound(new ResponseDto<string> { Message = "Department Not Found" });

            var departementId = departement.DepartementId;

            var tasksLevelByDepartmentId = (await GetTasks())
                                    .Where(s => s.DepartementId == departementId)
                                    .Select(s => s.TasksLevel).ToList();

            var dashboardData = new GetTaskDashboardStatisticsForDeptManager()
            {
                DepartementsCount = await GetDepartementCountForCompSupervisor(departementId),
                OrdersCount = await GetOrdersCount(userId),
                TasksCount = (await GetTasksCountForCompSupervisor(departementId)),
                DepartementsWithTasksCount = await GetDepartementWithTasks(userInDb.CompanyId, DepartementUnitType.Teams),
                TasksLevel = tasksLevelByDepartmentId,
                TasksCountForPreviousMonth = await GetTasksCountForPreviousMonth(userInDb.CompanyId)
            };

            return Ok(new ResponseDto<GetTaskDashboardStatisticsForDeptManager> { Data = dashboardData });
        }

        [HttpGet("GetTaskDashboardForEmployee")]
        public async Task<ActionResult> GetTaskDashboardForEmployee(string userId)
        {
            var userInDb = await _context.Users
                                    .Include(s => s.UserDepartments)
                                    .SingleOrDefaultAsync(s => s.Id == userId);

            if (userInDb == null) return NotFound(new ResponseDto<string> { Message = "User Not Found" });


            var departementId = userInDb.UserDepartments.FirstOrDefault().DepartementId;

            var tasksLevelByDepartmentId = (await GetTasks())
                                    .Where(s => s.TeamId == departementId)
                                    .Select(s => s.TasksLevel).ToList();

            var dashboardData = new TaskDashboardStatisticsForEmployee()
            {
                TasksCount = (await GetTasksCountForEmployee(departementId, userId)),
            };

            return Ok(new ResponseDto<TaskDashboardStatisticsForEmployee> { Data = dashboardData });
        }
        async Task<DepartementsCountDto> GetDepartementCountByCompanyId(int companyId)
        {
            var departementByCompanyIdDtos = (await GetDepartements())
                                                .Where(s => s.CompanyId == companyId)
                                                .ToList();

            var managementsCount = departementByCompanyIdDtos
                                .Where(s => s.UnitType == null)
                                .ToList()
                                .Count();

            var departementsCount = departementByCompanyIdDtos
                                .Where(s => s.UnitType == DepartementUnitType.Depts)
                                .ToList()
                                .Count();

            return new DepartementsCountDto { DepartementsCount = departementsCount, ManagementsCount = managementsCount };
        }
        async Task<List<DepartementDto>> GetManagements(int companyId)
        {
            var departementByCompanyIdDtos = (await GetDepartements())
                                                           .Where(s => s.CompanyId == companyId)
                                                           .ToList();

            return departementByCompanyIdDtos
                                .Where(s => s.UnitType == null)
                                .ToList();
        }
        async Task<List<DepartementDto>> GetDepartements(int managementId)
        {
            var departementByCompanyIdDtos = (await GetDepartements())
                                                           .SingleOrDefault(s => s.Id == managementId && s.UnitType == null)
                                                           .SubDepartements;

            return departementByCompanyIdDtos;
        }
        async Task<DepartementsCountDto> GetDepartementCountForDeptManager(int departementId)
        {
            var departementByCompanyIdDtos = (await GetDepartements())
                                                .Where(s => s.Id == departementId)
                                                .ToList();

            // var managementsCount = departementByCompanyIdDtos
            //                     .Where(s => s.UnitType == null)
            //                     .ToList()
            //                     .Count();

            var departementsCount = departementByCompanyIdDtos.Select(s => s.SubDepartements).Count();

            return new DepartementsCountDto { DepartementsCount = departementsCount };
        }
        async Task<DepartementsCountDto> GetDepartementCountForCompSupervisor(int departementId)
        {
            var departementByCompanyIdDtos = (await GetDepartements())
                                                .Where(s => s.Id == departementId)
                                                .ToList();

            // var managementsCount = departementByCompanyIdDtos
            //                     .Where(s => s.UnitType == null)
            //                     .ToList()
            //                     .Count();

            var teamsCount = departementByCompanyIdDtos.Select(s => s.SubDepartements).Count();


            return new DepartementsCountDto { TeamsCount = teamsCount };
        }
        async Task<int> GetEmployeesCountForDeptManager(int departementId)
        {
            var departementByCompanyIdDtos = (await GetDepartements())
                                                .Where(s => s.Id == departementId)
                                                .ToList();

            return departementByCompanyIdDtos
                        .SelectMany(s => s.UserDepartments.Select(x => x.User))
                        .ToList()
                        .Count();

        }
        async Task<List<DepartementDto>> GetDepartements()
        {
            var departementsInDb = await _context.Departements
                                                .Where(s => s.IsDeleted == false)
                                                .Include(s => s.Company)
                                                .Include(s => s.SubDepartements)
                                                .Include(s => s.UserDepartments)
                                                .ThenInclude(s => s.User)
                                                .ToListAsync();

            return departementsInDb
                            .Select(_mapper.Map<Departement, DepartementDto>)
                            .ToList();
        }
        async Task<int> GetOrdersCount(string userId)
        {
            var ordersInDb = await _context.Orders
                                               .Where(s => s.IsDeleted == false
                                                           && s.OwnerId == userId)
                                               .ToListAsync();
            return ordersInDb.Count();
        }
        async Task<TasksCountDto> GetTasksCountByCompanyId(int companyId)
        {
            var tasksDto = (await GetTasks())
                                .Where(s => s.CompanyId == companyId)
                                .ToList();

            return new TasksCountDto
            {
                NewTasksCount = GetNewTasks(tasksDto).Count(),
                InProgressTasksCount = GetInProgressTasks(tasksDto).Count(),
                FinishedTasksCount = GetFinishedTasks(tasksDto).Count()
            };
        }
        async Task<TasksCountDto> GetTasksCountForDeptManager(int departementId)
        {
            var tasksDto = (await GetTasks())
                               .Where(s => s.ManagementId == departementId)
                               .ToList();

            return new TasksCountDto
            {
                NewTasksCount = GetNewTasks(tasksDto).Count(),
                InProgressTasksCount = GetInProgressTasks(tasksDto).Count(),
                FinishedTasksCount = GetFinishedTasks(tasksDto).Count()
            };
        }
        async Task<TasksCountDto> GetTasksCountForEmployee(int departementId, string userId)
        {
            var tasksDto = (await GetTasks())
                               .Where(s => 
                               //s.TeamId == departementId
                               //         && 
                                        (s.CreatorId == userId || s.AssignedToId == userId))
                               .ToList();

            return new TasksCountDto
            {
                NewTasksCount = GetNewTasks(tasksDto).Count(),
                InProgressTasksCount = GetInProgressTasks(tasksDto).Count(),
                FinishedTasksCount = GetFinishedTasks(tasksDto).Count()
            };
        }
        async Task<TasksCountDto> GetTasksCountForCompSupervisor(int departementId)
        {
            var tasksDto = (await GetTasks())
                               .Where(s => s.DepartementId == departementId)
                               .ToList();

            return new TasksCountDto
            {
                NewTasksCount = GetNewTasks(tasksDto).Count(),
                InProgressTasksCount = GetInProgressTasks(tasksDto).Count(),
                FinishedTasksCount = GetFinishedTasks(tasksDto).Count()
            };
        }
        async Task<TasksCountDto> GetTasksCountForPreviousMonth(int companyId)
        {
            var tasksDto = (await GetTasks())
                                .Where(s => s.CompanyId == companyId)
                                .ToList();

            var newTasksCount = GetNewTasks(tasksDto).Where(s => s.CreatedAt.Month > 1).Select(s => s.CreatedAt.AddMonths(-1)).Count();
            var inProgressTasksCount = GetInProgressTasks(tasksDto).Where(s => s.CreatedAt.Month > 1).Select(s => s.CreatedAt.AddMonths(-1)).Count();
            var finishedTasksCount = GetFinishedTasks(tasksDto).Where(s => s.CreatedAt.Month > 1).Select(s => s.CreatedAt.AddMonths(-1)).Count();
            return new TasksCountDto
            {
                FinishedTasksCount = finishedTasksCount,
                InProgressTasksCount = inProgressTasksCount,
                NewTasksCount = newTasksCount

            };
        }
        async Task<TasksCountDto> GetDeptManagerTasksCountForPreviousMonth(int departementId)
        {
            var tasksDto = (await GetTasks())
                                .Where(s => s.ManagementId == departementId)
                                .ToList();


            return new TasksCountDto
            {
                NewTasksCount = GetNewTasks(tasksDto).Select(s => s.CreatedAt.AddMonths(-1)).Count(),
                InProgressTasksCount = GetInProgressTasks(tasksDto).Select(s => s.CreatedAt.AddMonths(-1)).Count(),
                FinishedTasksCount = GetFinishedTasks(tasksDto).Select(s => s.CreatedAt.AddMonths(-1)).Count()
            };
        }
        async Task<List<ManagementsWithDepartementsDto>> GetDepartementWithTasks(int companyId, string unitType)
        {
            var departementsAndManagementWithTasksDto = new DepartementsAndManagementWithTasksDto();
            var departementDtos = (await GetDepartements())
                                                .Where(s => s.CompanyId == companyId)
                                                .ToList();

            var tasks = (await GetTasks())
                                .Where(s => s.CompanyId == companyId)
                                .ToList();


            var newTasks = GetNewTasks(tasks);

            var inProgressTasks = GetInProgressTasks(tasks);

            var finishedTasks = GetFinishedTasks(tasks);

            var managementsWithDepartements = departementDtos
                                .Where(s => s.UnitType == unitType)
                                .GroupBy(s => s.ParentId,
                                             (key, g) => new ManagementsWithDepartementsDto
                                             {
                                                 Managements = key.Value,
                                                 Departements = g.ToList()
                                             });

            foreach (var item in managementsWithDepartements)
            {
                foreach (var departement in item.Departements)
                {
                    departement.TasksCounts = new TasksCountDto
                    {
                        NewTasksCount = newTasks.Where(s => s.DepartementId == departement.Id).ToList().Count(),
                        FinishedTasksCount = finishedTasks.Where(s => s.DepartementId == departement.Id).ToList().Count(),
                        InProgressTasksCount = inProgressTasks.Where(s => s.DepartementId == departement.Id).ToList().Count()
                    };
                }
            }
            return managementsWithDepartements.ToList();
        }
        async Task<DepartementsAndManagementWithTasksDto> GetDepartementWithTasksForDeptManager(int departementId)
        {
            var departementsAndManagementWithTasksDto = new DepartementsAndManagementWithTasksDto();
            var departementDtos = (await GetDepartements())
                                                .Where(s => s.Id == departementId)
                                                .ToList();

            var tasksDto = (await GetTasks())
                                .Where(s => s.ManagementId == departementId)
                                .ToList();


            var newTasks = GetNewTasks(tasksDto);

            var inProgressTasks = GetInProgressTasks(tasksDto);

            var finishedTasks = GetFinishedTasks(tasksDto);

            departementsAndManagementWithTasksDto.ManagementsWithTasks = departementDtos
                                .Where(s => s.UnitType == null)
                                .ToList()
                                .Select(x => new DepartementsWithTasksDto
                                {
                                    Departements = x,
                                    TasksCount = new TasksCountDto
                                    {
                                        NewTasksCount = newTasks.Count(),
                                        FinishedTasksCount = finishedTasks.Count(),
                                        InProgressTasksCount = inProgressTasks.Count()
                                    }
                                })
                                .ToList();

            departementsAndManagementWithTasksDto.DepartementsWithTasks = departementDtos
                                .Where(s => s.UnitType == DepartementUnitType.Depts)
                                .ToList()
                                .Select(x => new DepartementsWithTasksDto
                                {
                                    Departements = x,
                                    TasksCount = new TasksCountDto
                                    {
                                        NewTasksCount = newTasks.Count(),
                                        FinishedTasksCount = finishedTasks.Count(),
                                        InProgressTasksCount = inProgressTasks.Count()
                                    }
                                })
                                .ToList();

            return departementsAndManagementWithTasksDto;
        }
        async Task<List<TasksDto>> GetTasks()
        {
            var tasksInDb = await _context.Tasks
                               .Where(s => s.IsDeleted == false
                                && (s.NotificationTypeId == 5
                                    || s.NotificationTypeId == 6
                                    || s.NotificationTypeId == 10
                                    || s.NotificationTypeId == 11))
                               .Include(s => s.TasksLevel)
                               .Include(s => s.TasksStatus)
                               .Include(s => s.Departement)
                               .ToListAsync();

            return tasksInDb
                           .Select(_mapper.Map<Tasks, TasksDto>)
                           .ToList();
        }
        List<TasksDto> GetNewTasks(List<TasksDto> tasksDto)
        {
            return tasksDto.Where(s => s.TasksStatusId == (int)TasksStatusEnum.New).ToList();
        }
        List<TasksDto> GetInProgressTasks(List<TasksDto> tasksDto)
        {
            return tasksDto.Where(s => s.TasksStatusId == (int)TasksStatusEnum.InProgress).ToList();
        }
        List<TasksDto> GetFinishedTasks(List<TasksDto> tasksDto)
        {
            return tasksDto.Where(s => s.TasksStatusId == (int)TasksStatusEnum.Finished).ToList();
        }
    }
}