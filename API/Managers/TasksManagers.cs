using API.Data;
using API.Entities;
using API.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Interfaces;
using API.Managers;
using API.Services;
using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using API.Helpers.EmailTemplates;
using Microsoft.Extensions.Options;
using API.Enums;

namespace API.Managers
{
    public class TasksManagers : ITasksManager
    {
        private readonly IMailer mailer;
        private readonly IOptions<SmtpSettings> smtSettings;

        public TasksManagers(IMailer _mailer, IOptions<SmtpSettings> _smtSettings)
        {
            mailer = _mailer;
            smtSettings = _smtSettings;
        }
        public async Task<Tasks> AddCustomerCareTask(DataContext context, string userId)
        {
            //Get User Data
            AppUser user = await context.AppUsers.Where(x => x.Id == userId).
                Include(x => x.UserRoles).
                ThenInclude(x => x.Role).
                FirstOrDefaultAsync();
            //Get User Role
            var roleName = user.UserRoles.FirstOrDefault().Role.Name;
            //GetUserCompany
            var userCompany = await context.AppUsers.
                Where(x => x.Id == user.Id).
                Select(x => x.Company).
                FirstOrDefaultAsync();
            //Get Customer Care Role
            var customercarerole = await context.Roles.
                Where(x => x.Name == RoleName.OHSCustomerCare).
                FirstOrDefaultAsync();
            //get Customer Care Id
            var customercareroleid = customercarerole.Id;
            //Get Customer Care Team Manger
            AppUser AssignedTo = await context.UserRoles.
                Where(x => x.RoleId == customercareroleid).
                Select(x => x.User).
                Where(x => x.IsTeamManager == true).
                FirstOrDefaultAsync();

            var customerCareDept = context.Departements.SingleOrDefault(s => s.Id == 151)
                                                             .ParentId;

            var customerCareMangement = context.Departements
                                                 .SingleOrDefault(s => s.Id == customerCareDept)
                                                 .ParentId;
            //Create Task
            Tasks tasks = new Tasks();
            tasks.Number = await GetMaxTask(context);
            tasks.AssignedToId = AssignedTo.Id;
            tasks.CreatorId = user.Id;
            tasks.CompanyId = user.CompanyId;
            tasks.TasksLevelId = 4;
            tasks.TasksStatusId = 4;
            tasks.TeamId = 151;
            tasks.DepartementId = customerCareDept != null ? customerCareDept : null;
            tasks.ManagementId = customerCareMangement != null ? customerCareMangement : null;
            tasks.Description = GetNotifcationDisplayNameByRole(roleName);
            tasks.CreatedAt = CustomDateTimeConverter.Timezone();
            tasks.NotificationTypeId = GetNotifcationTypeByRole(context, roleName);
            await context.Tasks.AddAsync(tasks);
            await context.SaveChangesAsync();

            //Send Mail TO OHS Cutomer Care 
            try
            {
                await mailer.SendEmailSendGridAsync(
                    smtSettings.Value.TemplateIdCreatedTask,
                    new TaskEmailTemplate()
                    {
                        TaskNumber = "TSK_" + tasks.Number
                    },
                    AssignedTo.Email);
            }
            catch (Exception)
            { }

            //Create Notifcation
            await CreateNotification(context, user, roleName, tasks.Id);

            return tasks;
        }

        private string GetNotifcationDisplayNameByRole(string roleName)
        {
            var name = roleName;
            switch (roleName)
            {
                case RoleName.CompanyAdmin:
                    name = "New Company Admin Is Created , Please Review His Attachments.";
                    break;
                case RoleName.CompanyVendor:
                    name = "New Company Vendor Is Created , Please Review His Attachments To Activate His Account.";
                    break;
                case RoleName.IndividualVendor:
                    name = "New Individual Vendor Is Created , Please Review His Attachments To Activate His Account.";
                    break;
                case RoleName.CompanyDepartementManager:
                    name = "New Management User Is Created , Please Review His Attachments To Activate His Account";
                    break;
                case RoleName.CompanySupervisor:
                    name = "New Department Manager Is Created , Please Review His Attachments To Activate His Account";
                    break;
                case RoleName.CompanyEmployee:
                    name = "New Employee Is Created Is Created In Company";// [ " + companyId + " ]";
                    break;
                default:
                    break;
            }

            return name;
        }

        private int GetNotifcationTypeByRole(DataContext context, string roleName)
        {
            var NotificationTypeId = 5;
            switch (roleName)
            {
                case RoleName.CompanyAdmin:
                    NotificationTypeId = (int)NotificationTypes.NewManagerSubscription;
                    break;
                case RoleName.CompanyVendor:
                    NotificationTypeId = (int)NotificationTypes.CompanyVendorSubscription;
                    break;
                case RoleName.IndividualVendor:
                    NotificationTypeId = (int)NotificationTypes.IndividualVendorSubscription;
                    break;
                case RoleName.CompanyDepartementManager:
                    NotificationTypeId = (int)NotificationTypes.NewManagerSubscription;
                    break;
                case RoleName.CompanySupervisor:
                    NotificationTypeId = (int)NotificationTypes.NewManagerSubscription;
                    break;
                case RoleName.CompanyEmployee:
                    NotificationTypeId = (int)NotificationTypes.CompanyEmployeeSubscription;
                    break;
                default:
                    break;
            }

            return NotificationTypeId;
        }
        private string GetNotifcationShortNameByRole(string roleName)
        {
            var name = roleName + Environment.NewLine;

            switch (roleName)
            {
                case RoleName.CompanyAdmin:
                    name = "Company Admin";
                    break;
                case RoleName.CompanyVendor:
                    name = "Company Vendor";
                    break;
                case RoleName.IndividualVendor:
                    name = "Individual Vendor";
                    break;
                case RoleName.CompanyDepartementManager:
                    name = "Management User";
                    break;
                case RoleName.CompanySupervisor:
                    name = "Department Manager";
                    break;
                case RoleName.CompanyEmployee:
                    name = "Employee";
                    break;
                default:
                    break;
            }

            return name;
        }

        private async Task<int> GetMaxTask(DataContext context)
        {
            try
            {
                return await context.Tasks.MaxAsync(x => x.Number) + 1;
            }
            catch (Exception)
            {
                return 1;
            }
        }
        private async Task CreateNotification(DataContext context, AppUser user, string rollName, int TaskId)
        {
            var ohsUserTeamManager = context.Users
                                    .Where(s => s.CompanyId == 1
                                                        && s.UserRoles
                                                                .Any(urm => urm.Role.Name == "OHS Customer Care"));

            var notificationCreatedDate = CustomDateTimeConverter.Timezone();
            var notification = new Notification
            {
                Date = notificationCreatedDate,
                Body = GetNotifcationDisplayNameByRole(rollName) + "  " + " Created At " + notificationCreatedDate,
                NotificationTypeId = (int)NotificationTypes.CompanyVendorSubscription,
                Title = GetNotifcationShortNameByRole(rollName) + " " + user.UserName + " Created",
                UserId = ohsUserTeamManager.Any(s => s.IsTeamManager == true)
                                    ? ohsUserTeamManager.FirstOrDefault(x => x.IsTeamManager == true).Id
                                    : ohsUserTeamManager.FirstOrDefault().Id,
                TasksId = TaskId,
                RelatedUser = user,
                User = ohsUserTeamManager.FirstOrDefault(x => x.IsTeamManager == true)
            };

            await context.Notifications.AddAsync(notification);
            await context.SaveChangesAsync();
        }
    }
}
