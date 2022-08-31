using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using API.Enums;
using API.Helpers;

namespace API.Controllers
{
    public class ContactUsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IMailer _mailer;
        private readonly SmtpSettings _smtSettings;
        public ContactUsController(DataContext context, IMapper mapper, IMailer mailer, IOptions<SmtpSettings> smtSettings)
        {
            _smtSettings = smtSettings.Value;
            _context = context;
            _mapper = mapper;
            _mailer = mailer;
        }
        [HttpGet("GetContactUsMessage")]
        public async Task<ActionResult> GetContactUsMessage()
        {
            var result = await _context.ContactUsMsgs
                                    .Where(s => s.IsDeleted == false)
                                    .OrderByDescending(s => s.MessageDate)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<ContactUsMsg, ContactUsMsgDto>));
        }
        [HttpGet("GetContactUsMessageById")]
        public async Task<ActionResult> GetContactUsMessageById(int msgId)
        {
            var result = await _context.ContactUsMsgs
                                    .Where(s => s.IsDeleted == false && s.Id == msgId)
                                    .SingleOrDefaultAsync();

            if (result == null) return NotFound();

            return Ok(_mapper.Map<ContactUsMsg, ContactUsMsgDto>(result));
        }

        [HttpPost("AddContactUsMessage")]
        public async Task<ActionResult> AddContactUsMessage(CreateContactUsMsgDto contactUsMsgDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            // var user = await _context.Users.SingleOrDefaultAsync(s => s.Email == contactUsMsgDto.Email);
            // if (user == null) return NotFound();
            var customercarerole = await _context.Roles.
                        Where(x => x.Name == RoleName.OHSCustomerCare).
                        FirstOrDefaultAsync();
            //get Customer Care Id
            var customercareroleid = customercarerole.Id;
            //Get Customer Care Team Manger
            AppUser OhsCustomerCareTeamManger = await _context.UserRoles.
                Where(x => x.RoleId == customercareroleid).
                Select(x => x.User).
                Where(x => x.IsTeamManager == true).
                FirstOrDefaultAsync();

            await _mailer.SendContactUsCustomerCareAsync(new ContactUsMessageSendMailDto
            {
                Email = OhsCustomerCareTeamManger.Email,
                Message = contactUsMsgDto.Message,
                UserFullName = contactUsMsgDto.Username,
                Mobile = contactUsMsgDto.Mobile
            });

            var contactUsMsg = _mapper.Map<CreateContactUsMsgDto, ContactUsMsg>(contactUsMsgDto);
            contactUsMsg.MessageDate = CustomDateTimeConverter.Timezone();
            await _context.ContactUsMsgs.AddAsync(contactUsMsg);
            await _context.SaveChangesAsync();

            return Ok(contactUsMsg);
        }
        [HttpPost("ReplyOnContactUsMsg")]
        public async Task<ActionResult> ReplyOnContactUsMsg(ReplyOnContactUsMsgDto msgDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            var user = await _context.Users.SingleOrDefaultAsync(s => s.Email == msgDto.Email);
            if (user == null) return NotFound();


            await _mailer.SupportSendEmailAsync(new SupportSendEmailDto
            {
                Subject = "Reply On Your Message",
                Email = msgDto.Email,
                Message = msgDto.Message,
                Name = user.FullName,
                Mobile = user.PhoneNumber
            });


            return Ok();
        }
        [HttpPost("DeleteContactUsMsg")]
        public async Task<ActionResult> DeleteContactUsMsg(int id)
        {
            var contactUsMsgInDb = await _context.ContactUsMsgs
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (contactUsMsgInDb == null) return NotFound();

            contactUsMsgInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}
