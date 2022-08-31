using API.Data;
using API.DTOs.Polls;
using API.Entities.Polls;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers.EmailTemplates;
using API.Interfaces;
using Microsoft.Extensions.Options;
using API.Helpers;

namespace API.Controllers.Polls
{
    public class PollItemActionsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IMailer mailer;
        private readonly IOptions<SmtpSettings> smtSettings;

        public PollItemActionsController(DataContext context, IMapper mapper, IMailer _mailer, IOptions<SmtpSettings> _smtSettings)
        {
            _context = context;
            _mapper = mapper;
            mailer = _mailer;
            smtSettings = _smtSettings;
        }

        [HttpGet("GetPollItemActions")]

        public async Task<ActionResult> GetPollItemActions(int pollId)
        {
            var pollItemActions = await _context.Polls.
                         Where(s => s.IsDeleted == false && s.Id == pollId).
                         Include(x => x.PollItemAction.Where(x => x.IsDeleted == false)).
                         ThenInclude(x => x.PollItem).
                         Select(x => x.PollItemAction).
                         FirstOrDefaultAsync();
            if (pollItemActions == null) return NoContent();

            return Ok(pollItemActions.Select(_mapper.Map<PollItemAction, PollItemActionDto>).ToList());
        }
        [HttpGet("GetPollItemActionById")]

        public async Task<ActionResult> GetPollItemActionById(int id)
        {
            var pollItemAction = await _context.PollItemActions.
                         Where(s => s.IsDeleted == false && s.Id == id).
                         Include(x => x.PollItem.IsDeleted == false && x.IsVisible == true).
                         FirstOrDefaultAsync();
            if (pollItemAction == null) return NoContent();

            return Ok(_mapper.Map<PollItemAction, PollItemActionDto>(pollItemAction));
        }

        [HttpGet("GetTaskForPollItemAction")]

        public async Task<ActionResult> GetTaskForPollItemAction(int pollItemActionId)
        {
            var task = await _context.PollItemActions.
                         Where(s => s.IsDeleted == false && s.Id == pollItemActionId).
                         Include(x => x.Tasks).
                         Select(x => x.Tasks).
                         FirstOrDefaultAsync();

            if (task == null) return NoContent();

            return Ok(_mapper.Map<Tasks, TasksDto>(task));
        }

        [HttpPost("CreatePollItemAction")]
        public async Task<ActionResult> CreatePollItemAction(PollItemActionDto pollItemActionDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var pollItemAction = _mapper.Map<PollItemActionDto, PollItemAction>(pollItemActionDto);




            var tasks = _mapper.Map<TasksDto, Tasks>(pollItemActionDto.Tasks);

            var assignedTo = _context.Users
                              .Include(s => s.UserRoles)
                              .ThenInclude(s => s.Role)
                              .SingleOrDefault(s => s.Id == tasks.AssignedToId);

            if (assignedTo == null) return NotFound();

            var assignedToRole = assignedTo.UserRoles
                                    .FirstOrDefault()
                                    .Role;

            if (assignedToRole.Name == "Company Admin"
              || assignedToRole.Name == "Company Delegated Admin"
              || assignedToRole.Name == "Company Departement Manager")
            {
                tasks.TeamId = null;
                tasks.DepartementId = null;
                tasks.ManagementId = tasks.ManagementId;
                // tasks.NotificationTypeId = 1;
            }
            else if (assignedToRole.Name == "Company Supervisor")
            {
                tasks.TeamId = null;
                tasks.DepartementId = tasks.DepartementId;
                tasks.ManagementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasks.DepartementId)
                                                    .ParentId;
                // tasks.NotificationTypeId = 1;

            }
            else
            {
                tasks.TeamId = tasks.TeamId;
                tasks.DepartementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasks.TeamId)
                                                    .ParentId;

                tasks.ManagementId = _context.Departements
                                                    .SingleOrDefault(s => s.Id == tasks.DepartementId)
                                                    .ParentId;
                // tasks.NotificationTypeId = 9;

            }








            tasks.TeamId = tasks.TeamId != null ? tasks.TeamId : null;
            tasks.DepartementId = tasks.DepartementId != null ? tasks.DepartementId : null;
            tasks.ManagementId = tasks.ManagementId != null ? tasks.ManagementId : null;
            tasks.CreatedAt = CustomDateTimeConverter.Timezone();
            tasks.Number = _context.Tasks.Max(x => x.Number) + 1;

            await _context.Tasks.AddAsync(tasks);
            await _context.SaveChangesAsync();

            pollItemActionDto.Tasks.Id = tasks.Id;


            try
            {
                var AssignedToId = await _context.Users.FindAsync(pollItemActionDto.Tasks.AssignedToId);
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

            var notificationCreatedDate = CustomDateTimeConverter.Timezone();
            var notification = new Notification
            {
                Date = notificationCreatedDate,
                Body = "تم إسناد مهمة جديدة لك رقم " + " TSK_" + tasks.Number + " , برجاء مراجعتها والعمل عليها أو عمل تفويض للشخص المناسب للعمل عليها",
                NotificationTypeId = pollItemActionDto.Tasks.NotificationTypeId == null 
                                        ? 10 : pollItemActionDto.Tasks.NotificationTypeId.Value,
                Title = "تم إسناد مهمة جديدة لك رقم " + " TSK_" + tasks.Number,
                UserId = tasks.AssignedTo.Id,
                TasksId = tasks.Id,
            };

            pollItemAction.Tasks = null;
            pollItemAction.TasksId = tasks.Id;
            _context.PollItemActions.Add(pollItemAction);
            await _context.Notifications.AddAsync(notification);

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<PollItemAction, PollItemActionDto>(pollItemAction));
        }

        [HttpPost("DeletePollItemAction")]
        public async Task<ActionResult> DeletePollItemAction(int pollItemActionId)
        {

            var pollItemActionDb = await _context.PollItemActions
                                  .SingleOrDefaultAsync(s => s.Id == pollItemActionId
                                                        && s.IsDeleted == false);

            if (pollItemActionDb == null) return NotFound();

            pollItemActionDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);

        }

        [HttpPost("UpdatePollItemAction")]
        public async Task<ActionResult> UpdatePollItemAction(PollItemActionDto pollItemActionDto)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var pollItemActionDb = await _context.PollItemActions
                                    .SingleOrDefaultAsync(s => s.Id == pollItemActionDto.Id
                                                            && s.IsDeleted == false);

            if (pollItemActionDb == null)
                return NotFound();

            pollItemActionDb = _mapper.Map<PollItemActionDto, PollItemAction>(pollItemActionDto);
            var result = await _context.SaveChangesAsync() > 0 ? pollItemActionDb : null;
            return Ok(result);
        }

    }
}
