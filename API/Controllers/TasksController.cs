using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Helpers;
using API.Helpers.EmailTemplates;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Controllers
{
    public class TasksController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IMailer mailer;
        private readonly IOptions<SmtpSettings> smtSettings;

        public TasksController(DataContext context, IMapper mapper, IMailer _mailer, IOptions<SmtpSettings> _smtSettings)
        {
            _context = context;
            _mapper = mapper;
            mailer = _mailer;
            smtSettings = _smtSettings;
        }
        [HttpGet("GetAllTasks")]
        public async Task<ActionResult> GetAllTasks()
        {
            var result = await _context.Tasks
                                    .Include(s => s.Creator)
                                    .Include(s => s.AssignedTo)
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Tasks, TasksDto>));
        }
        [HttpGet("GetTasksForForm")]
        public async Task<ActionResult> GetTasksForForm(int formId)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            try
            {
                var userCompany = _context.Users.Where(x => x.Id == userId).FirstOrDefault().CompanyId;
                var result = await _context.Tasks
                                  .Include(x => x.Creator)
                                  .Include(x => x.AssignedTo)
                                  .Where(s => s.IsDeleted == false && s.FormId == formId && s.CompanyId == userCompany)
                                  .ToListAsync();

                if (result == null) return NotFound();

                return Ok(result.Select(_mapper.Map<Tasks, TasksDto>));
            }
            catch (Exception)
            {
                return NotFound();
            }


        }
        [HttpGet("GetTasksForDepartment")]
        public async Task<ActionResult> GetTasksForDepartment(int DepartmentId)
        {
            var result = await _context.Tasks
                                    .Include(s => s.TasksStatus)
                                    .Include(s => s.Creator)
                                    .Include(s => s.AssignedTo)
                                    .Where(s => s.IsDeleted == false && s.DepartementId == DepartmentId)
                                    .ToListAsync();


            return Ok(result.Select(_mapper.Map<Tasks, TasksDto>));
        }
        [HttpGet("GetTasksForManagement")]
        public async Task<ActionResult> GetTasksForManagement(int managementId)
        {
            var result = await _context.Tasks
                                    .Include(s => s.TasksStatus)
                                    .Include(s => s.Creator)
                                    .Include(s => s.AssignedTo)
                                    .Where(s => s.IsDeleted == false && s.ManagementId == managementId)
                                    .ToListAsync();

            var tasksExceeded = result.Where(s =>
                                    s.TargetDate.HasValue 
                                    && CustomDateTimeConverter.Timezone(s.TargetDate.Value)< CustomDateTimeConverter.Timezone())
                                    .ToList();

            if (tasksExceeded.Count > 0)
            {
                tasksExceeded.ForEach(s =>
                {
                    if (s.TasksStatusId == (int)TasksStatusEnum.New)
                    {
                        s.TasksStatusId = (int)TasksStatusEnum.StillExist;
                    }
                });
                _context.SaveChanges();
            }
            return Ok(result.Select(_mapper.Map<Tasks, TasksDto>));
        }
        [HttpGet("GetTasksByUserId")]
        public async Task<ActionResult> GetTasksByUserId(string userId)
        {
            var result = await _context.Tasks
                                    .Where(s => s.IsDeleted == false && (s.CreatorId == userId || s.AssignedToId == userId) && (
                                        s.NotificationTypeId == 5 ||
                                        s.NotificationTypeId == 6 ||
                                        s.NotificationTypeId == 10 ||
                                        s.NotificationTypeId == 11
                                        )).
                                     Include(x => x.AssignedTo).
                                     Include(x => x.Creator).
                                     ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Tasks, TasksDto>));
        }
        [HttpGet("GetTasksById/{id}")]

        public async Task<ActionResult> GetTasksById(int id)
        {
            var tasksInDb = await _context.Tasks
                                .Include(s => s.Creator)
                                .Include(s => s.AssignedTo)
                                .Include(s => s.NotificationType)
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (tasksInDb == null) return NotFound();

            //get owner id 
            var res = _mapper.Map<Tasks, TasksDto>(tasksInDb);
            var notifcationwithattachemts = new List<int>() { 1, 2, 7, 8, 9 };

            if (notifcationwithattachemts.Contains(res.NotificationTypeId.Value))
            {

                var allAttachments = await _context.SubscriptionTypeAttachments
                                                      .Where(s => s.UserId == res.CreatorId && s.IsDeleted == false)
                                                      .Include(x => x.SubscriptionTypeAttachmentMapping).
                                                      ThenInclude(x => x.Attachment)
                                                      .ToListAsync();
                res.SubscriptionAttachments = allAttachments;//.Select(_mapper.Map<SubscriptionTypeAttachment, SubscriptionTypeAttachmentDto>).ToList();

            }

            var tasksAttachments = await _context.TasksAttachments.Where(x => x.TaskId == res.Id).ToListAsync();
            res.TasksAttachments = tasksAttachments.Select(_mapper.Map<TasksAttachment, TasksAttachmentDTO>).ToList();

            return Ok(res);
        }
        [HttpGet("GetAttachementTaskForUser")]

        public async Task<ActionResult> GetAttachementTaskForUser(string userId)
        {
            var notifcationwithattachemts = new List<int>() { 1, 2, 7, 8, 9 };
            var tasksInDb = await _context.Tasks.
                                OrderBy(x => x.Id).
                                LastOrDefaultAsync(s => s.CreatorId == userId && s.IsDeleted == false
                                && notifcationwithattachemts.Contains(s.NotificationTypeId.Value));

            if (tasksInDb == null) return NotFound();

            //get owner id 
            var res = _mapper.Map<Tasks, TasksDto>(tasksInDb);

            if (notifcationwithattachemts.Contains(res.NotificationTypeId.Value))
            {

                var allAttachments = await _context.SubscriptionTypeAttachments
                                                      .Where(s => s.UserId == res.CreatorId && s.IsDeleted == false)
                                                      .Include(x => x.SubscriptionTypeAttachmentMapping).
                                                      ThenInclude(x => x.Attachment)
                                                      .ToListAsync();
                res.SubscriptionAttachments = allAttachments;//.Select(_mapper.Map<SubscriptionTypeAttachment, SubscriptionTypeAttachmentDto>).ToList();

            }


            res.SubscriptionAttachments.ForEach(x =>
            {
                x.ImageUrl = x.ImageUrl != null ? "https://ohsjoeq.com/Images/Clients/" + x.ImageUrl : null;
            });
            var tasksAttachments = await _context.TasksAttachments.Where(x => x.TaskId == res.Id).ToListAsync();
            res.TasksAttachments = tasksAttachments.Select(_mapper.Map<TasksAttachment, TasksAttachmentDTO>).ToList();

            return Ok(res);
        }

        [HttpPost("UpdateTasks")]
        public async Task<ActionResult> UpdateTasks(UpdateTasksDto tasksDto)
        {
            var items = new List<int>() { 8, 9, 10, };
            if (!items.Contains(tasksDto.TasksStatusId))
            {
                if (!ModelState.IsValid)
                    return BadRequest();
            }

            var tasksInDb = await _context.Tasks
                                    .SingleOrDefaultAsync(s => s.Id == tasksDto.Id && s.IsDeleted == false);

            if (tasksInDb == null)
                return NotFound();

            var tasks = _mapper.Map(tasksDto, tasksInDb);


            //check if Tasks Status  is "OHSJOEQ Support"
            if (tasks.TasksStatusId == 9)
            {
                var ohsCustomerCareManger = await GetOHSCustomerCareTeamManger();
                tasks.AssignedToId = ohsCustomerCareManger.Id;
            }


            var assignedTo = _context.Users
                              .Include(s => s.UserRoles)
                              .ThenInclude(s => s.Role)
                              .SingleOrDefault(s => s.Id == tasksDto.AssignedToId);

            if (assignedTo == null) return NotFound();

            var assignedToRole = assignedTo.UserRoles
                                    .FirstOrDefault()
                                    .Role;

            // var tasks = _mapper.Map<TasksDto, Tasks>(tasksDto);

            if (tasks.TasksStatusId == 9)
                tasks.NotificationTypeId = 5;
            else
                tasks.NotificationTypeId = 10;


            if (assignedToRole.Name == "Company Admin"
                || assignedToRole.Name == "Company Delegated Admin"
                || assignedToRole.Name == "Company Departement Manager")
            {
                tasks.TeamId = null;
                tasks.DepartementId = null;
                tasks.ManagementId = tasksDto.ManagementId;
                // tasks.NotificationTypeId = 1;
            }
            else if (assignedToRole.Name == "Company Supervisor")
            {
                tasks.TeamId = null;
                tasks.DepartementId = tasksDto.DepartementId;
                tasks.ManagementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasksDto.DepartementId)
                                                    .ParentId;
                // tasks.NotificationTypeId = 1;

            }
            else
            {
                tasks.TeamId = tasksDto.TeamId;
                tasks.DepartementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasksDto.TeamId)
                                                    .ParentId;

                tasks.ManagementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasks.DepartementId)
                                                    .ParentId;
                // tasks.NotificationTypeId = 9;

            }



            var random = new Random();
            //check if Tasks Status  is  "منتهية"
            if (tasks.TasksStatusId == 6)
            {
                var riskEvaluationMembers = await GetRiskEvaluationMembers(tasksInDb.CreatorId);
                tasks.AssignedToId = riskEvaluationMembers[random.Next(riskEvaluationMembers.Count())];
            }
            if (tasks.TasksStatusId == 8)
            {
                tasks.AssignedToId = tasksDto.AssignedToId;
            }
            //check if Tasks Status  is "Not Fixed" 
            if (tasks.TasksStatusId == 10)
            {

                tasks.AssignedToId = tasks.CreatorId;
            }
            try
            {
                var AssignedToId = await _context.Users.FindAsync(tasks.AssignedToId);
                if (AssignedToId != null)
                    //Send Mail TO Assigned To User
                    await mailer.SendEmailSendGridAsync(
                    smtSettings.Value.TemplateIdCreatedTask,
                    new TaskEmailTemplate()
                    {
                        TaskNumber = "TSK_" + tasks.Number
                    },
                    AssignedToId.Email);
            }
            catch (Exception) { }

            //get notification

            try
            {
                var currentUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var notificationForUserandTask = await _context.Notifications.
                    Where(x => x.UserId == currentUser && x.TasksId == tasksDto.Id).
                    FirstOrDefaultAsync();
                notificationForUserandTask.IsDeleted = true;
                //if (notificationForUserandTask != null)
                //{
                //    _context.Notifications.Remove(notificationForUserandTask);
                await _context.SaveChangesAsync();
                // }
            }
            catch (Exception)
            {

                //throw;
            }

            var notificationCreatedDate = CustomDateTimeConverter.Timezone();
            var notification = new Notification
            {
                Date = notificationCreatedDate,
                Body = "لديك اشعار جديد بخصوص مهمة رقم " + " TSK_" + tasks.Number + " , برجاء مراجعتها",
                NotificationTypeId = tasks.NotificationTypeId == null ? 10 : tasks.NotificationTypeId.Value,
                Title = "لديك اشعار جديد بخصوص مهمة رقم " + " TSK_" + tasks.Number,
                UserId = tasks.AssignedToId,
                TasksId = tasks.Id,
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateTasks")]
        public async Task<ActionResult> CreateTasks(TasksDto tasksDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var assignedTo = _context.Users
                                .Include(s => s.UserRoles)
                                .ThenInclude(s => s.Role)
                                .SingleOrDefault(s => s.Id == tasksDto.AssignedToId);

            if (assignedTo == null) return NotFound();

            var assignedToRole = assignedTo.UserRoles
                                    .FirstOrDefault()
                                    .Role;

            var tasks = _mapper.Map<TasksDto, Tasks>(tasksDto);

            if (tasks.TasksStatusId == 9)
                tasks.NotificationTypeId = 5;
            else
                tasks.NotificationTypeId = 10;


            if (assignedToRole.Name == "Company Admin"
                || assignedToRole.Name == "Company Delegated Admin"
                || assignedToRole.Name == "Company Departement Manager")
            {
                tasks.TeamId = null;
                tasks.DepartementId = null;
                tasks.ManagementId = tasksDto.ManagementId;
                // tasks.NotificationTypeId = 1;
            }
            else if (assignedToRole.Name == "Company Supervisor")
            {
                tasks.TeamId = null;
                tasks.DepartementId = tasksDto.DepartementId;
                tasks.ManagementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasksDto.DepartementId)
                                                    .ParentId;
                // tasks.NotificationTypeId = 1;

            }
            else
            {
                tasks.TeamId = tasksDto.TeamId;
                tasks.DepartementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasksDto.TeamId)
                                                    .ParentId;

                tasks.ManagementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasks.DepartementId)
                                                    .ParentId;
                // tasks.NotificationTypeId = 9;

            }

            tasks.CreatedAt = CustomDateTimeConverter.Timezone();
            tasks.Number = _context.Tasks.Max(x => x.Number) + 1;


            //check if Tasks Status  is "OHSJOEQ Support"
            if (tasks.TasksStatusId == 9)
            {
                var ohsCustomerCareManger = await GetOHSCustomerCareTeamManger();
                tasks.AssignedToId = ohsCustomerCareManger.Id;
            }

            var random = new Random();
            //check if Tasks Status  is "Not Fixed"
            if (tasks.TasksStatusId == 10)
            {
                var riskEvaluationMembers = await GetRiskEvaluationMembers(tasks.CreatorId);
                tasks.AssignedToId = riskEvaluationMembers[random.Next(riskEvaluationMembers.Count())];
            }

            await _context.Tasks.AddAsync(tasks);
            await _context.SaveChangesAsync();

            tasksDto.Id = tasks.Id;

            try
            {
                var AssignedToId = await _context.Users.FindAsync(tasksDto.AssignedToId);
                if (AssignedToId != null)
                    //Send Mail TO Assigned To User
                    await mailer.SendEmailSendGridAsync(
                    smtSettings.Value.TemplateIdCreatedTask,
                    new TaskEmailTemplate()
                    {
                        TaskNumber = "TSK_" + tasks.Number
                    },
                    AssignedToId.Email);
            }
            catch (Exception) { }

            // create notification
            await CreateNotificationBeforeTwoDays(tasks);

            return Ok(_mapper.Map<Tasks, TasksDto>(tasks));
        }

        private async Task CreateNotificationBeforeTwoDays(Tasks tasks)
        {
            var notificationCreatedDate = CustomDateTimeConverter.Timezone();
            var notifications = new List<Notification>
            {
                new Notification
                {
                    Date = notificationCreatedDate,
                    Body = "تم إسناد مهمة جديدة لك رقم " + " TSK_" + tasks.Number + " , برجاء مراجعتها والعمل عليها أو عمل تفويض للشخص المناسب للعمل عليها",
                    NotificationTypeId = tasks.NotificationTypeId == null ? 10 : tasks.NotificationTypeId.Value,
                    Title = "تم إسناد مهمة جديدة لك رقم " + " TSK_" + tasks.Number,
                    UserId = tasks.AssignedTo.Id,
                    TasksId = tasks.Id,
                }

            };

            //var ddd = tasks.TargetDate.Value >= System.DateTime.Today.AddDays(2);

            if (tasks.TargetDate.HasValue && tasks.TargetDate.Value > System.DateTime.UtcNow.AddDays(2))
            {
                var newDate = CustomDateTimeConverter.Timezone(tasks.TargetDate.Value.AddDays(-2));

                notifications.Add(new Notification
                {
                    Date = newDate,
                    Body = "يرجى مراجعة مهمة رقم " + " TSK_" + tasks.Number + " , برجاء مراجعتها والعمل عليها أو عمل تفويض للشخص المناسب للعمل عليها",
                    NotificationTypeId = tasks.NotificationTypeId == null ? 10 : tasks.NotificationTypeId.Value,
                    Title = "يرجى مراجعة مهمة رقم " + " TSK_" + tasks.Number,
                    UserId = tasks.AssignedTo.Id,
                    TasksId = tasks.Id,
                });
            }
            notifications.ForEach(async n => await _context.Notifications.AddAsync(n));
            //await _context.Notifications.AddRangeAsync(notifications);
            await _context.SaveChangesAsync();
        }

        private async Task<AppUser> GetOHSCustomerCareTeamManger()
        {

            var customercarerole = await _context.Roles.
                Where(x => x.Name == RoleName.OHSCustomerCare).
                FirstOrDefaultAsync();
            //get Customer Care Id
            var customercareroleid = customercarerole.Id;
            //Get Customer Care Team Manger
            AppUser AssignedTo = await _context.UserRoles.
                Where(x => x.RoleId == customercareroleid).
                Select(x => x.User).
                Where(x => x.IsTeamManager == true).
                FirstOrDefaultAsync();

            return AssignedTo;
        }

        private async Task<List<string>> GetRiskEvaluationMembers(string userId)
        {

            var user = await _context.AppUsers
                        .Where(x => x.Id == userId && x.IsDeleted == false).
                        Include(x => x.UserDepartments).
                        FirstOrDefaultAsync();

            var riskmangement = await _context.Departements.Where(x => x.CompanyId == user.CompanyId && x.CorrespondingDeptId == 142).
                FirstOrDefaultAsync();

            var riskEvaluationDepartment = await _context.Departements.
                Where(x => x.ParentId == riskmangement.Id).
                FirstOrDefaultAsync();


            var result = await _context.Departements.FromSqlRaw(@";WITH Recursives AS (
                                                                SELECT *
                                                                FROM    Departements d
                                                                WHERE   d.id = " + riskEvaluationDepartment.Id + @"
                                                                UNION ALL
                                                                SELECT  d2.*
                                                                FROM     Departements d2 INNER JOIN
                                                                        Recursives r    ON  d2.ParentId = r.Id
                                                                )
                                                                SELECT*
                                                                FROM    Recursives"
                                                       ).ToListAsync();

            var subdepartmentIdList = result.Select(x => x.Id).Distinct().ToList();
            subdepartmentIdList.Add(user.UserDepartments.FirstOrDefault().DepartementId);

            var finalresult = await _context.UserDepartments
                      .Where(x => subdepartmentIdList.Contains(x.DepartementId))
                      .Include(x => x.Departement)
                      .Include(x => x.User)
                      .ThenInclude(x => x.UserRoles)
                      .ThenInclude(x => x.Role)
                      .Where(x => x.User.IsDeleted == false && x.User.Id != user.Id)
                      .Select(x => x.User.Id)
                      .ToListAsync();

            return finalresult;

        }
        [HttpGet("GetTaskStatisticsByStatus")]
        public async Task<ActionResult> GetTaskStatisticsByStatus(int DepartementId)
        {
            var tasks = await _context.Tasks.
                                  Where(s => s.DepartementId == DepartementId && s.IsDeleted == false).
                                  Include(x => x.TasksStatus).
                                  ToListAsync();

            var taskStatus = await _context.TasksStatus.Where(x => x.IsDeleted == false && x.IsVisible == true).ToListAsync();
            var newTasksList = taskStatus.Select(x => new
            {
                name = x.Name,
                value = tasks.Count(s => s.TasksStatusId == x.Id)
            });
            return Ok(newTasksList);
        }


        [HttpGet("GetTaskStatisticsByLevel")]
        public async Task<ActionResult> GetTaskStatisticsByLevel(int DepartementId)
        {
            var tasks = await _context.Tasks.
                                  Where(s => s.DepartementId == DepartementId && s.IsDeleted == false).
                                  Include(x => x.TasksStatus).
                                  ToListAsync();

            var taskStatus = await _context.TasksLevels.Where(x => x.IsDeleted == false && x.IsVisible == true).ToListAsync();
            var newTasksList = taskStatus.Select(x => new
            {
                name = x.Name,
                value = tasks.Count(s => s.TasksLevelId == x.Id)
            });
            return Ok(newTasksList);
        }
        [HttpPost("DeleteTasks")]
        public async Task<ActionResult> DeleteTasks(int id)
        {
            var tasksInDb = await _context.Tasks
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (tasksInDb == null) return NotFound();

            tasksInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }

        private async Task<UserAttachmentsDto> GetUserDetails(string id)
        {
            var userAttachmentsDto = new UserAttachmentsDto();

            var user = await _context.AppUsers
                                .Include(s => s.Company)
                                .Include(s => s.SubscriptionType)
                                .Include(s => s.UserDepartments)
                                .ThenInclude(x => x.Departement)
                                .Include(s => s.UserRoles)
                                .ThenInclude(s => s.Role)
                                .SingleOrDefaultAsync(x => x.Id == id
                                                        && x.IsDeleted == false);






            var userDto = _mapper.Map<AppUser, AppUserDto>(user);

            if (user.UserRoles.Any(urm => urm.Role.Name == "Company Employee" || urm.Role.Name == "Company Delegated Admin"))
            {
                userDto.AllAttachmentsUploaded = true;
                userAttachmentsDto.User = userDto;
                return userAttachmentsDto;
            }


            userDto.AllAttachmentsUploaded = false;

            var allAttachments = await _context.SubscriptionTypeAttachmentMappings
                                                       .Where(s => s.SubscriptionTypeId == user.SubscriptionTypeId)
                                                       .Include(s => s.Attachment)
                                                       .ToListAsync();

            var userAttachmentUploaded = await _context.SubscriptionTypeAttachments
                                                        .Where(s => s.UserId == id)
                                                        .Include(s => s.SubscriptionTypeAttachmentMapping)
                                                        .ThenInclude(s => s.Attachment)
                                                        .ToListAsync();

            var userAttachmentUploadedIDs = userAttachmentUploaded
                                                .Select(s => s.SubscriptionTypeAttachmentMappingId)
                                                .ToList();


            var attachmentsUploadedDto = new List<AttachmentWithSubscriptionTypeIdDto>();

            if (userAttachmentUploaded.Count == 0)
            {
                userAttachmentsDto.User = userDto;
                userAttachmentsDto.AttachmentWithSubscriptionTypeId = allAttachments.Select(s => (
                    new AttachmentWithSubscriptionTypeIdDto
                    {
                        Attachment = _mapper.Map<Attachment, AttachmentDto>(s.Attachment),
                        SubscriptionTypeId = s.Id
                    })).ToList();
                return userAttachmentsDto;
            }

            var anotherAttachmentMustBeUploaded = allAttachments
                                            .Where(s => !userAttachmentUploadedIDs.Contains(s.Id))
                                            .Select(s => new AttachmentWithSubscriptionTypeIdDto { Attachment = _mapper.Map<Attachment, AttachmentDto>(s.Attachment), SubscriptionTypeId = s.Id })
                                            .ToList();

            anotherAttachmentMustBeUploaded.ForEach(s =>
            {
                var attachmentDto = (s.Attachment);
                attachmentsUploadedDto.Add(
                    new AttachmentWithSubscriptionTypeIdDto
                    {
                        Attachment = attachmentDto,
                        SubscriptionTypeId = s.SubscriptionTypeId
                    });
            });

            userAttachmentUploaded.ForEach(s =>
            {

                if (s.ImageUrl == null)
                {
                    var attachmentDto = _mapper.Map<Attachment, AttachmentDto>(s.SubscriptionTypeAttachmentMapping.Attachment);
                    attachmentsUploadedDto.Add(
                   new AttachmentWithSubscriptionTypeIdDto
                   {
                       Attachment = attachmentDto,
                       SubscriptionTypeId = s.SubscriptionTypeAttachmentMappingId
                   });
                }

            });

            if (attachmentsUploadedDto.Count > 0)
            {
                userAttachmentsDto.User = userDto;
                userAttachmentsDto.AttachmentWithSubscriptionTypeId = attachmentsUploadedDto;
                return userAttachmentsDto;
            }

            userDto.AllAttachmentsUploaded = true;
            userAttachmentsDto.User = userDto;
            userAttachmentsDto.AttachmentWithSubscriptionTypeId = attachmentsUploadedDto;

            return userAttachmentsDto;

        }
    }
}