using API.Data;
using API.DTOs.Polls;
using API.Entities.Polls;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers.Polls
{
    public class PollDetailsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PollDetailsController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpGet("GetPollDetailsById")]
        public async Task<ActionResult> GetPollDetailsById(int id)
        {
            var polls = await _context.PollDetails.
                        Where(s => s.IsDeleted == false && s.Id == id).
                        ToListAsync();

            return Ok(polls.Select(_mapper.Map<PollDetail, PollDetailDto>).ToList());
        }


        [HttpGet("GetEmployeesForPollItem")]
        public async Task<ActionResult> GetEmployeesForPollItem(int itemId)
        {
            var polls = await _context.PollDetails.
                        Where(s => s.IsDeleted == false && s.PollItemId == itemId && s.PollItemValue == true).
                        Include(x => x.AppUser.UserRoles).
                        ThenInclude(x => x.Role).
                        Include(x => x.AppUser).
                        Include(x => x.AppUser).
                        ThenInclude(x => x.UserDepartments).
                        ThenInclude(x => x.Departement).
                        ToListAsync();
            var result = polls.Select(x => new
            {
                fullName = x.AppUser.FullName,
                userDepartment = x.AppUser.UserDepartments.FirstOrDefault().Departement.Name,
                userRole = x.AppUser.UserRoles.FirstOrDefault().Role.Name,
                mobile = x.AppUser.PhoneNumber,
                Email = x.AppUser.Email,
            }).ToList();

            return Ok(result);
        }



        [HttpGet("GetPollDetailsStatistic")]
        public async Task<ActionResult> GetPollDetailsStatistic(int pollId)
        {
            var PollDetails = await _context.Polls.
                        Where(s => s.IsDeleted == false && s.Id == pollId).
                        Include(x => x.PollDetails.Where(x => x.IsDeleted == false && x.PollId == pollId)).
                        Include(x => x.PollItems.Where(x => x.IsDeleted == false && x.IsVisible == true && x.PollId == pollId)).

                        FirstOrDefaultAsync();

            var itemNotAgreeOrAgree = PollDetails.PollItems.Where(x => !PollDetails.PollDetails.Select(x => x.PollItemId).ToList().Contains(x.Id)).ToList();
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userAppreovalOnItem = await _context.PollApprovals.
                Where(x => x.AppUserId == userId && x.PollId == pollId).
                ToListAsync();



            var pollstatistic = PollDetails.PollDetails.GroupBy(x => x.PollItem).Select((x, y) => new
            {
                item = _mapper.Map<PollItem, PollItemDto>(x.Key),
                Agree = x.Count(x => x.PollItemValue == true),
                NotAgree = x.Count(x => x.PollItemValue == false),
                unknown = x.Count(x => x.PollItemValue == null),
                AgreeRate = (int)((float)(x.Count(x => x.PollItemValue == true) / (float)PollDetails.TotalEmployees) * 100),
                Approval = userAppreovalOnItem.
                 Where(s => s.PollItemId == x.Key.Id).
                 Select(_mapper.Map<PollApproval, PollApprovalDto>).
                 FirstOrDefault()
            }).ToList();

            itemNotAgreeOrAgree.ForEach(x =>
            {
                pollstatistic.Add(new
                {
                    item = _mapper.Map<PollItem, PollItemDto>(x),
                    Agree = 0,
                    NotAgree = 0,
                    unknown = 0,
                    AgreeRate = 0,
                    Approval = new PollApprovalDto()
                });
            });

            return Ok(pollstatistic.Where(s => s.AgreeRate != 0).OrderByDescending(x => x.AgreeRate));
        }

        [HttpPost("CreatePollDetails")]

        public async Task<ActionResult> CreatePollDetails(List<PollDetailDto> pollDetailDtos)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var pollDetailDtosDb = pollDetailDtos.Select(_mapper.Map<PollDetailDto, PollDetail>).ToList();
            try
            {
                var currentUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var notificationForUserandTask = await _context.Notifications.
                    Where(x => x.UserId == currentUser && x.PollId == pollDetailDtos[0].PollId).
                    FirstOrDefaultAsync();
                if (notificationForUserandTask != null)
                    notificationForUserandTask.IsDeleted = true;
            }
            catch (System.Exception)
            {

                //   throw;
            }
            await _context.PollDetails.AddRangeAsync(pollDetailDtosDb);
            await _context.SaveChangesAsync();
            return Ok(pollDetailDtosDb.Select(_mapper.Map<PollDetail, PollDetailDto>).ToList());
        }



        [HttpPost("DeletePollDetails")]
        public async Task<ActionResult> DeletePollDetails(int pollItemId)
        {

            var pollDetails = await _context.PollDetails
                                  .SingleOrDefaultAsync(s => s.Id == pollItemId
                                                        && s.IsDeleted == false);

            if (pollDetails == null) return NotFound();

            pollDetails.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("UpdatePollDetails")]
        public async Task<ActionResult> UpdatePollDetails(PollDetailDto pollDetail)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var pollDetailDb = await _context.PollDetails
                                    .SingleOrDefaultAsync(s => s.Id == pollDetail.Id
                                                            && s.IsDeleted == false);

            if (pollDetailDb == null)
                return NotFound();

            pollDetailDb = _mapper.Map<PollDetailDto, PollDetail>(pollDetail);
            var result = await _context.SaveChangesAsync() > 0 ? pollDetailDb : null;
            return Ok(result);
        }

    }
}
