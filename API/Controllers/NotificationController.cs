using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{
    public class NotificationController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public NotificationController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllNotification()
        {
            var result = await _context.Notifications
                                    .Include(s => s.User)
                                    .Include(s => s.NotificationType)
                                    .Include(s => s.Tasks)
                                    .Include(s => s.Poll)
                                    .Where(s => s.IsDeleted == false)
                                    .OrderByDescending(s => s.Date)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Notification, NotificationDto>));
        }
        [HttpGet("GetNotificationById/{id}")]

        public async Task<ActionResult> GetNotificationById(int id)
        {
            var notificationInDb = await _context.Notifications
                                    .Include(s => s.User)
                                    .Include(s => s.NotificationType)
                                    .Include(s => s.Poll)
                                    .Include(s => s.Tasks)
                                    .OrderByDescending(s => s.Date)
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (notificationInDb == null) return NotFound();

            return Ok(_mapper.Map<Notification, NotificationDto>(notificationInDb));
        }
        [HttpGet("GetNotificationsByUserId")]
        public async Task<ActionResult> GetNotificationsByUserId(string UserId)
        {
            try
            {
                var notificationList = await _context.Notifications
                                 .Include(s => s.User)
                                 .Include(s => s.NotificationType)
                                 .Include(s => s.Poll)
                                 .Include(s => s.Tasks)
                                 .Include(s => s.Tasks.Company)
                                 .Include(s => s.Tasks.Departement)
                                 .Include(s => s.Tasks.Creator)
                                 .OrderByDescending(s => s.Date)
                                 .Where(s => s.UserId == UserId
                                    && s.IsDeleted == false
                                    && (s.NotificationTypeId == 5 ||
                                         s.NotificationTypeId == 6 ||
                                         s.NotificationTypeId == 10 ||
                                         s.NotificationTypeId == 11)
                                     && s.Date <= System.DateTime.Today)
                                 .ToListAsync();
                var result = new NotificationModelDTO();
                result.UnReadedCount = notificationList.Count(x => x.IsRead != true);
                result.ReadedCount = notificationList.Count(x => x.IsRead == true);
                result.Notifications = notificationList.Select(_mapper.Map<Notification, NotificationDto>).ToList();
                // if (notificationList.Count == 0) return NotFound();
                return Ok(result);
            }
            catch (System.Exception ex)
            {

                throw;
            }

        }
        [HttpPost("UpdateNotification")]
        public async Task<ActionResult> UpdateNotification(int id, NotificationDto notificationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var notificationInDb = await _context.Notifications
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (notificationInDb == null)
                return NotFound();

            _mapper.Map(notificationDto, notificationInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("UpdateNotificationToRead")]
        public async Task<ActionResult> UpdateNotificationToReaded(int notificationId)
        {
            var userNotification = await _context.Notifications.Where(x => x.Id == notificationId && x.IsDeleted == false).FirstOrDefaultAsync();
            userNotification.IsRead = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("CreateNotification")]
        public async Task<ActionResult> CreateNotification(NotificationDto notificationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var notification = _mapper.Map<NotificationDto, Notification>(notificationDto);
            notification.Date = CustomDateTimeConverter.Timezone();
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            notificationDto.Id = notification.Id;

            return Ok(notificationDto);
        }

        [HttpPost("DeleteNotification")]
        public async Task<ActionResult> DeleteNotification(int id)
        {
            var notificationInDb = await _context.Notifications
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (notificationInDb == null) return NotFound();

            notificationInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }


    }
}