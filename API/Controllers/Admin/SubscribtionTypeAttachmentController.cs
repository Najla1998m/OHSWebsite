

using API.Data;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Helpers;
using API.Helpers.EmailTemplates;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers.Admin
{
    public class SubscriptionTypeAttachmentController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly SmtpSettings smtpSettings;
        private readonly IMailer mailer;

        public SubscriptionTypeAttachmentController(DataContext context, IMapper mapper, IOptions<SmtpSettings> _smtpSettings, IMailer _mailer)
        {
            _context = context;
            _mapper = mapper;
            smtpSettings = _smtpSettings.Value;
            mailer = _mailer;
        }
        [HttpGet("GetAllSubscriptionTypeAttachment")]
        public async Task<ActionResult> GetAllSubscriptionTypeAttachment()
        {
            var result = await _context.SubscriptionTypeAttachments
                                    .Where(s => s.IsDeleted == false)
                                    .Include(s => s.SubscriptionTypeAttachmentMapping.Attachment)
                                    .Include(s => s.SubscriptionTypeAttachmentMapping.SubscriptionType)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<SubscriptionTypeAttachment, SubscriptionTypeAttachmentDto>));
        }
        [HttpGet("GetAllAttachmentBySubscriptionTypeId")]
        public async Task<ActionResult> GetAllAttachmentBySubscriptionTypeId(int id)
        {

            var allAttachmentBySubscriptionType = await _context.SubscriptionTypeAttachmentMappings
                                                            .Include(s => s.Attachment)
                                                            .Where(x => x.SubscriptionTypeId == id)
                                                            .ToArrayAsync();


            if (allAttachmentBySubscriptionType == null) return NotFound();

            var result = allAttachmentBySubscriptionType.Select(s => new AttachmentWithSubscriptionTypeIdDto
            {
                Attachment = _mapper.Map<Attachment, AttachmentDto>(s.Attachment),
                SubscriptionTypeId = s.SubscriptionTypeId,
                SubscriptionTypeAttachmentMappingId = s.Id
            });

            return Ok(result);
        }
        [HttpGet("GetAllBasicAttachment")]
        public async Task<ActionResult> GetAllBasicAttachment()
        {
            var allAttachmentBySubscriptionType = await _context.SubscriptionTypeAttachmentMappings.Where(x => x.SubscriptionTypeId == 1).Select(x => x.Attachment).ToArrayAsync();


            if (allAttachmentBySubscriptionType == null) return NotFound();

            return Ok(allAttachmentBySubscriptionType.Select(_mapper.Map<Attachment, AttachmentDto>));
        }
        [HttpGet("GetSubscriptionTypeAttachmentById/{id}")]

        public async Task<ActionResult> GetSubscriptionTypeAttachmentById(int id)
        {
            var attachmentInDb = await _context.SubscriptionTypeAttachments
                                .Include(s => s.SubscriptionTypeAttachmentMapping.Attachment)
                                .Include(s => s.SubscriptionTypeAttachmentMapping.SubscriptionType)
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (attachmentInDb == null) return NotFound();

            return Ok(_mapper.Map<SubscriptionTypeAttachment, SubscriptionTypeAttachmentDto>(attachmentInDb));
        }
        [HttpPost("UpdateSubscriptionTypeAttachment")]
        public async Task<ActionResult> UpdateSubscriptionTypeAttachment(int id, SubscriptionTypeAttachmentDto attachmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var attachmentInDb = await _context.SubscriptionTypeAttachments
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (attachmentInDb == null)
                return NotFound();

            _mapper.Map(attachmentDto, attachmentInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateSubscriptionTypeAttachment")]
        public async Task<ActionResult> CreateSubscriptionTypeAttachment(SubscriptionTypeAttachmentDto attachmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var attachment = _mapper.Map<SubscriptionTypeAttachmentDto, SubscriptionTypeAttachment>(attachmentDto);
            await _context.SubscriptionTypeAttachments.AddAsync(attachment);
            await _context.SaveChangesAsync();

            attachmentDto.Id = attachment.Id;

            return Ok(attachmentDto);
        }

        [HttpPost("DeleteSubscriptionTypeAttachment")]
        public async Task<ActionResult> DeleteSubscriptionTypeAttachment(int id)
        {
            var attachmentInDb = await _context.SubscriptionTypeAttachments
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (attachmentInDb == null) return NotFound();

            attachmentInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }


        [HttpPost("DeleteSubscriptionTypeAttachmentList")]
        public async Task<ActionResult> DeleteSubscriptionTypeAttachmentList(DeleteSubscriptionTypeAttachmentDTO
            deleteSubscriptionTypeAttachmentDTO)
        {


            var attachmentInDb = await _context.SubscriptionTypeAttachments
                                  .Where(s => deleteSubscriptionTypeAttachmentDTO.SubscriptionTypeAttachmentList.Contains(s.Id) && s.IsDeleted == false)
                                  .Include(x => x.SubscriptionTypeAttachmentMapping)
                                  .ThenInclude(x => x.Attachment)
                                  .ToListAsync();

            if (attachmentInDb == null) return NotFound();
            //Get attachment Names String
            var allDeletedAttachmentsNames = "";
            attachmentInDb.ForEach(x =>
            {
                allDeletedAttachmentsNames = x.SubscriptionTypeAttachmentMapping.Attachment.Name + Environment.NewLine;
                x.ImageUrl = null;
            });

            var res = await _context.SaveChangesAsync() > 0;
            var Task = await _context.Tasks.Where(x => x.Id == deleteSubscriptionTypeAttachmentDTO.TaskId).
                Include(x => x.Creator).FirstOrDefaultAsync();

            //try create notifcation 
            try
            {
                Notification notification = new Notification()
                {
                    Body = deleteSubscriptionTypeAttachmentDTO.RejectReason + Environment.NewLine + allDeletedAttachmentsNames,
                    Date = CustomDateTimeConverter.Timezone(),
                    NotificationTypeId = (int)NotificationTypes.ContactSupportMessage,
                    TasksId = deleteSubscriptionTypeAttachmentDTO.TaskId,
                    UserId = Task.CreatorId,
                    Title = deleteSubscriptionTypeAttachmentDTO.RejectReason
                };
                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();
            }
            catch (Exception) { }

            //Try Sned Email
            try
            {
                await mailer.SendEmailSendGridAsync(smtpSettings.DeleteSubscriptionTypeAttachmentList,
                    new RejectedAttachmentsTemplete()
                    {
                        RejectedAttachments = allDeletedAttachmentsNames,
                        RejectReason = deleteSubscriptionTypeAttachmentDTO.RejectReason
                    }, Task.Creator.Email
                );
            }
            catch (Exception) { }

            return Ok(res);
        }
    }
}