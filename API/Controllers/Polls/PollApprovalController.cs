using API.Data;
using API.DTOs;
using API.DTOs.Polls;
using API.Entities;
using API.Entities.Polls;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers.Polls
{
    public class PollApprovalController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PollApprovalController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpGet("GetPollApprovals")]
        public async Task<ActionResult> GetPollDetailsById(int pollId,string userId)
        {
            var PollApprovals = await _context.PollApprovals.
                        Where(s => s.IsDeleted == false && s.PollId == pollId&&s.AppUserId== userId).
                        Include(x => x.PollItem).
                        Include(x => x.AppUser).
                        ToListAsync();

            var PollApprovalsGroupByAppUser = PollApprovals.GroupBy(x => x.AppUser).
                                       Select((x) => new
                                       {
                                           AppUser = _mapper.Map<AppUser, AppUserDto>(x.Key),
                                           PollApprovalList = x.Select(x => new
                                           {
                                               PollApproval = _mapper.Map<PollApproval, PollApprovalDto>(x)
                                           }).
                                           ToList(),
                                       }).
                                       ToList();

            return Ok(PollApprovalsGroupByAppUser);
        }
        [HttpGet("GetPollApprovalById")]
        public async Task<ActionResult> GetPollApprovalById(int PollApprovalId)
        {
            var pollApproval = await _context.PollApprovals.
                        Where(s => s.IsDeleted == false && s.Id == PollApprovalId).
                        Include(x => x.PollItem).
                        FirstOrDefaultAsync();


            return Ok(_mapper.Map<PollApproval, PollApprovalDto>(pollApproval));
        }

        [HttpPost("CreatePollApproval")]
        public async Task<ActionResult> CreatePollApproval(PollApprovalDto pollApprovalDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var pollApproval = _mapper.Map<PollApprovalDto, PollApproval>(pollApprovalDto);
             _context.PollApprovals.Add(pollApproval);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<PollApproval, PollApprovalDto>(pollApproval));
        }



        [HttpPost("DeletePollApproval")]
        public async Task<ActionResult> DeletePollApproval(int PollApprovalId)
        {

            var pollItemDb = await _context.PollApprovals
                                  .SingleOrDefaultAsync(s => s.Id == PollApprovalId
                                                        && s.IsDeleted == false);

            if (pollItemDb == null) return NotFound();

            pollItemDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);

        }

        [HttpPost("UpdatePollApproval")]
        public async Task<ActionResult> UpdatePollApproval(PollApprovalDto pollApprovalDto)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var pollApprovalDb = await _context.PollApprovals
                                    .SingleOrDefaultAsync(s => s.Id == pollApprovalDto.Id
                                                            && s.IsDeleted == false);

            if (pollApprovalDb == null)
                return NotFound();

            pollApprovalDb = _mapper.Map<PollApprovalDto, PollApproval>(pollApprovalDto);
            var result = await _context.SaveChangesAsync() > 0 ? pollApprovalDb : null;
            return Ok(result);
        }

    }
}
