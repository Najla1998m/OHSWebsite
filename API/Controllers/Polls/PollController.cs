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
using API.Entities;
using System.ComponentModel;
using API.Helpers;
using System.Security.Claims;

namespace API.Controllers.Polls
{
    public class PollController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PollController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("GetAllPoll")]
        public async Task<ActionResult> GetAllPoll()
        {
            var polls = await _context.Polls.
                        Where(s => s.IsDeleted == false).
                        ToListAsync();

            return Ok(polls.Select(_mapper.Map<Poll, PollDto>).ToList());
        }

        [HttpGet("GetPollById/{id}")]

        public async Task<ActionResult> GetPollById(int id)
        {
            var polls = await _context.Polls.
                       Where(s => s.IsDeleted == false && s.Id == id).
                       ToListAsync();

            return Ok(polls.Select(_mapper.Map<Poll, PollDto>).ToList());

        }

        [HttpGet("GetPollsByCompanyId")]
        public async Task<ActionResult> GetPollsByCompanyId(int CompanyId)
        {
            var polls = await _context.Polls.
                       Where(s => s.IsDeleted == false && s.CompanyId == CompanyId).
                       ToListAsync();

            return Ok(polls.Select(_mapper.Map<Poll, PollDto>).ToList());
        }

        [HttpGet("GetPollDetailsByPollId")]
        public async Task<ActionResult> GetPollDetailsByPollId(int pollId)
        {

            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var polls = await _context.Polls.
                       Where(s => s.IsDeleted == false && s.Id == pollId).
                       Include(x => x.PollApproval.Where(x => x.IsDeleted == false)).
                       Include(x => x.PollDetails.Where(x => x.IsDeleted == false&&x.AppUserId==currentUser)).
                       Include(x => x.PollItems.Where(x => x.IsVisible == true && x.IsDeleted == false)).
                       Include(s => s.PollItemAction).
                       ThenInclude(s => s.Tasks).
                       ToListAsync();

            return Ok(polls.Select(_mapper.Map<Poll, PollDto>).ToList());
        }

        [HttpPost("CreatePoll")]
        public async Task<ActionResult> CreatePoll(PollDto PollDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            //create new Poll
            PollDto.Date = CustomDateTimeConverter.Timezone();

            var usersInCompay = await _context.AppUsers.
              Where(x => x.CompanyId == PollDto.CompanyId && x.IsDeleted == false).
              ToListAsync();

            PollDto.TotalEmployees = usersInCompay.Count();

            var poll = _mapper.Map<PollDto, Poll>(PollDto);
            await _context.Polls.AddAsync(poll);
            await _context.SaveChangesAsync();
            //get default Poll Items
            var PollItems = await _context.PollItems.Where(x => x.IsDeleted == false && x.IsVisible == true && x.PollId == null).ToListAsync();
            //create new PollItems
            var newPollItemsList = new List<PollItem>();
            PollItems.ForEach(x =>
            {
                newPollItemsList.Add(new PollItem()
                {
                    IsDeleted = false,
                    IsVisible = true,
                    Name = x.Name,
                    PollId = poll.Id
                });
            });
            //add New Poll Items To db
            await _context.PollItems.AddRangeAsync(newPollItemsList);
            await _context.SaveChangesAsync();
            //set 
            poll.PollItems = newPollItemsList;


            List<Notification> notifications = new List<Notification>();
            usersInCompay.ForEach(x =>
            {
                notifications.Add(new Notification()
                {
                    Date = CustomDateTimeConverter.Timezone(),
                    Title =  poll.Name,
                    UserId = x.Id,
                    Body = " يوجد إستبيان مخاطر جديد مطلوب منك العمل عليه واختيار المخاطر التي تواجهك وإرساله مرة أخري , شكرا لك",
                    NotificationTypeId = 11,
                    Poll = poll,
                    PollId = poll.Id
                });
            });
            await _context.Notifications.AddRangeAsync(notifications);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<Poll, PollDto>(poll));
        }

        //[HttpPost("UpdateClient")]
        //public async Task<ActionResult> UpdateClient(int id, ClientDto clientDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    var clientInDb = await _context.Clients
        //                            .SingleOrDefaultAsync(s => s.Id == id
        //                                                    && s.IsDeleted == false);

        //    if (clientInDb == null)
        //        return NotFound();

        //    var clientInDbByOrder = await _context.Clients
        //                             .SingleOrDefaultAsync(s => s.Order == clientDto.Order
        //                                                     && s.Order != clientInDb.Order
        //                                                     && s.IsDeleted == false);

        //    if (clientInDbByOrder != null)
        //        return BadRequest("Enter another order");

        //    clientDto.Image = _imageConversion.SaveImageToPath(clientDto.Image, ImagesPath.Clients, clientDto.ImageName);
        //    clientDto.Id = id;

        //    var client = _mapper.Map(clientDto, clientInDb);

        //    var result = await _context.SaveChangesAsync() > 0 ? clientDto : null;

        //    result.Image = _imageConversion.GetImagePath(ImagesPath.Clients, clientDto.Image);

        //    return Ok(result);
        //}
        //[HttpPost("CreateClient")]
        //public async Task<ActionResult> CreateClient(ClientDto clientDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest();

        //    var clientInDb = await _context.Clients
        //                             .SingleOrDefaultAsync(s => s.Order == clientDto.Order
        //                                                     && s.IsDeleted == false);

        //    if (clientInDb != null)
        //        return BadRequest("Enter another order");

        //    clientDto.Image = _imageConversion.SaveImageToPath(clientDto.Image, ImagesPath.Clients, clientDto.ImageName);

        //    var client = _mapper.Map<ClientDto, Client>(clientDto);

        //    await _context.Clients.AddAsync(client);
        //    await _context.SaveChangesAsync();

        //    clientDto.Image = _imageConversion.GetImagePath(ImagesPath.Clients, clientDto.Image);
        //    clientDto.Id = client.Id;

        //    return Ok(clientDto);
        //}
        //[HttpPost("DeleteClient")]
        //public async Task<ActionResult> DeleteClient(int id)
        //{
        //    var clientInDb = await _context.Clients
        //                          .SingleOrDefaultAsync(s => s.Id == id
        //                                                && s.IsDeleted == false);

        //    if (clientInDb == null) return NotFound();

        //    clientInDb.IsDeleted = true;
        //    return Ok(await _context.SaveChangesAsync() > 0);
        //}
        // }
    }
}
