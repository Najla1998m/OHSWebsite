using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class NotificationTypeController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public NotificationTypeController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllNotificationType")]
        public async Task<ActionResult> GetAllNotificationType()
        {
            var result = await _context.NotificationTypes
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<NotificationType, NotificationTypeDto>));
        }
        [HttpGet("GetNotificationTypeById/{id}")]

        public async Task<ActionResult> GetNotificationTypeById(int id)
        {
            var notificationTypeInDb = await _context.NotificationTypes
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (notificationTypeInDb == null) return NotFound();

            return Ok(_mapper.Map<NotificationType, NotificationTypeDto>(notificationTypeInDb));
        }
        [HttpPost("UpdateNotificationType")]
        public async Task<ActionResult> UpdateNotificationType(int id, NotificationTypeDto notificationTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var notificationTypeInDb = await _context.NotificationTypes
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (notificationTypeInDb == null)
                return NotFound();

            _mapper.Map(notificationTypeDto, notificationTypeInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateNotificationType")]
        public async Task<ActionResult> CreateNotificationType(NotificationTypeDto notificationTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var notificationType = _mapper.Map<NotificationTypeDto, NotificationType>(notificationTypeDto);
            await _context.NotificationTypes.AddAsync(notificationType);
            await _context.SaveChangesAsync();

            notificationTypeDto.Id = notificationType.Id;

            return Ok(notificationTypeDto);
        }

        [HttpPost("DeleteNotificationType")]
        public async Task<ActionResult> DeleteNotificationType(int id)
        {
            var notificationTypeInDb = await _context.NotificationTypes
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (notificationTypeInDb == null) return NotFound();

            notificationTypeInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}