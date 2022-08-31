using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Managers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Admin
{
    public class AttachmentController : BaseApiController
    {
        private readonly IImageConversion _imageConversion;
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ITasksManager tasksManager;
        public AttachmentController(DataContext context, IMapper mapper, IImageConversion imageConversion, ITasksManager tasksManager)
        {
            _context = context;
            _mapper = mapper;
            _imageConversion = imageConversion;
            this.tasksManager = tasksManager;
        }
        [HttpGet("GetAllAttachment")]
        public async Task<ActionResult> GetAllAttachment()
        {
            var result = await _context.Attachments
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Attachment, AttachmentDto>));
        }
        [HttpGet("GetAttachmentById/{id}")]

        public async Task<ActionResult> GetAttachmentById(int id)
        {
            var attachmentInDb = await _context.Attachments
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (attachmentInDb == null) return NotFound();

            return Ok(_mapper.Map<Attachment, AttachmentDto>(attachmentInDb));
        }
        [HttpPost("UpdateAttachment")]
        public async Task<ActionResult> UpdateAttachment(int id, AttachmentDto attachmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var attachmentInDb = await _context.Attachments
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (attachmentInDb == null)
                return NotFound();

            _mapper.Map(attachmentDto, attachmentInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateAttachment")]
        public async Task<ActionResult> CreateAttachment(AttachmentDto attachmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var attachment = _mapper.Map<AttachmentDto, Attachment>(attachmentDto);
            await _context.Attachments.AddAsync(attachment);
            await _context.SaveChangesAsync();

            attachmentDto.Id = attachment.Id;

            return Ok(attachmentDto);
        }
        [HttpPost("CreateSubscriptionTypeAttachement")]
        public async Task<ActionResult> CreateSubscriptionTypeAttachement(SubscriptionTypeAttachementDto subscriptionTypeAttachementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var attachment = new Attachment()
            {
                Name = subscriptionTypeAttachementDto.Name,
                IsOptional = subscriptionTypeAttachementDto.IsOptional,
                IsVisible = subscriptionTypeAttachementDto.IsVisible
            };

            await _context.Attachments.AddAsync(attachment);

            await _context.SaveChangesAsync();
            var SubscriptionTypeAttachmentMappings = new SubscriptionTypeAttachmentMapping()
            {
                AttachmentId = attachment.Id,
                SubscriptionTypeId = subscriptionTypeAttachementDto.SubscriptionTypeId
            };
            await _context.SubscriptionTypeAttachmentMappings.AddAsync(SubscriptionTypeAttachmentMappings);

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<Attachment, AttachmentDto>(attachment));
        }

        [HttpPost("DeleteAttachment")]
        public async Task<ActionResult> DeleteAttachment(int id)
        {
            var attachmentInDb = await _context.Attachments
                                  .SingleOrDefaultAsync(s => s.Id == id);

            if (attachmentInDb == null) return NotFound();

            var attachmentMappings = await _context.SubscriptionTypeAttachmentMappings
                                                .Where(s => s.AttachmentId == attachmentInDb.Id)
                                                .ToListAsync();

            var attachmentMappingsIDs = attachmentMappings.Select(s => s.Id).ToList();

            var subscriptionTypeAttachments = await _context.SubscriptionTypeAttachments
                                                           .Where(s => attachmentMappingsIDs.Contains(s.SubscriptionTypeAttachmentMappingId))
                                                           .ToListAsync();
            attachmentMappings.ForEach(s =>
           {
               _context.SubscriptionTypeAttachmentMappings.Remove(s);
               // var subscriptionTypeAttachments = await _context.SubscriptionTypeAttachments
               //                                     .SingleOrDefaultAsync(x => x.SubscriptionTypeAttachmentMappingId == s.Id);
               // if (subscriptionTypeAttachments != null)
               //     _context.SubscriptionTypeAttachments.Remove(subscriptionTypeAttachments);
           });
            subscriptionTypeAttachments.ForEach(s =>
            {
                _context.SubscriptionTypeAttachments.Remove(s);

            });
            // _context.SubscriptionTypeAttachments.Where(s=>s.SubscriptionTypeAttachmentMappingId==attachmentMappings.)
            _context.Attachments.Remove(attachmentInDb);
            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("UploadSubscriptionAttachment")]
        public async Task<ActionResult> UploadSubscriptionAttachment(List<SubscriptionAttachmentsDto> SubscriptionAttachments)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var UserId = SubscriptionAttachments[0].UserId;

            var user = await _context.Users
                            .Include(s => s.Company)
                            .SingleOrDefaultAsync(s => s.Id == UserId);

            if (user == null) return NotFound();

            SubscriptionAttachments.ForEach(x =>
             {
                 x.ImageUrl = _imageConversion.SaveImageToPath(x.Image, ImagesPath.Clients, x.UserId + "_" + x.Name);

             });

            SubscriptionAttachments.ForEach(x =>
              {
                  if (x.Name.ToLower().Contains("company logo"))
                  {
                      user.Company.Logo = _imageConversion.SaveImageToPath(x.Image, ImagesPath.Clients, x.Name);
                  }
              });

            int count = 0;
            List<SubscriptionTypeAttachment> OldsubscriptionTypeAttachments = new List<SubscriptionTypeAttachment>();
            List<SubscriptionTypeAttachment> newsubscriptionTypeAttachments = new List<SubscriptionTypeAttachment>();


            OldsubscriptionTypeAttachments = await _context.SubscriptionTypeAttachments.
                Where(x => SubscriptionAttachments.
                        Select(x => x.SubscriptionTypeAttachmentMappingId).
                        ToList().
                        Contains(x.SubscriptionTypeAttachmentMappingId) && x.UserId == UserId).
                ToListAsync();
            OldsubscriptionTypeAttachments.ForEach(x =>
            {
                x.ImageUrl = SubscriptionAttachments.
                                Where(x => x.SubscriptionTypeAttachmentMappingId == x.SubscriptionTypeAttachmentMappingId).
                                FirstOrDefault().ImageUrl;
                SubscriptionAttachments.Remove(SubscriptionAttachments.
                                Where(x => x.SubscriptionTypeAttachmentMappingId == x.SubscriptionTypeAttachmentMappingId).
                                FirstOrDefault());
            });

            SubscriptionAttachments.ForEach(async x =>
           {
               //get stored


               await _context.SubscriptionTypeAttachments.AddAsync(new SubscriptionTypeAttachment()
               {
                   ImageUrl = x.ImageUrl,
                   UserId = x.UserId,
                   SubscriptionTypeAttachmentMappingId = x.SubscriptionTypeAttachmentMappingId
               });
               count++;

           });

           
            await _context.SaveChangesAsync();
            //Add Task
            await tasksManager.AddCustomerCareTask(_context, user.Id);
           
            dynamic Uploadstatuse = new System.Dynamic.ExpandoObject();
            Uploadstatuse.Uploaded = count;
            Uploadstatuse.Faild = SubscriptionAttachments.Count - count;
            return Ok(Uploadstatuse);
        }
    }
}