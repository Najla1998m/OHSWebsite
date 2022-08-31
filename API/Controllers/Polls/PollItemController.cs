using API.Data;
using API.DTOs.Polls;
using API.Entities.Polls;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers.Polls
{
    public class PollItemController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PollItemController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //[HttpGet("GetAllPollItem")]
        //public async Task<ActionResult> GetAllPollItem()
        //{
        //    var polls = await _context.PollItems.
        //                Where(s => s.IsDeleted == false).
        //                ToListAsync();

        //    return Ok(polls.Select(_mapper.Map<PollItem, PollItemDto>).ToList());
        //}

        [HttpGet("GetDefaultPollItems")]
        public async Task<ActionResult> GetDefaultPollItems()
        {
            var polls = await _context.PollItems.
                        Where(s => s.IsDeleted == false && s.PollId == null).
                        ToListAsync();

            return Ok(polls.Select(_mapper.Map<PollItem, PollItemDto>).ToList());
        }

        [HttpGet("GetPollItemById/{id}")]

        public async Task<ActionResult> GetPollItem(int id)
        {
            var polls = await _context.PollItems.
                       Where(s => s.IsDeleted == false && s.Id == id && s.IsVisible == true).
                       ToListAsync();

            return Ok(polls.Select(_mapper.Map<PollItem, PollItemDto>).ToList());

        }

        [HttpPost("AddPollItem")]
        public async Task<ActionResult> AddPollItem(PollItemDto pollItemDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var pollItem = _mapper.Map<PollItemDto, PollItem>(pollItemDto);
            _context.PollItems.Add(pollItem);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<PollItem, PollItemDto>(pollItem));
        }

        [HttpPost("DeletePollItem")]
        public async Task<ActionResult> DeletePollItem(int pollItemId)
        {

            var pollItemDb = await _context.PollItems
                                  .SingleOrDefaultAsync(s => s.Id == pollItemId
                                                        && s.IsDeleted == false);

            if (pollItemDb == null) return NotFound();

            pollItemDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);

        }

        [HttpPost("UpdatePollItem")]
        public async Task<ActionResult> UpdatePollItem(PollItemDto pollItemDto)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var pollItemsInDb = await _context.PollItems
                                    .SingleOrDefaultAsync(s => s.Id == pollItemDto.Id
                                                            && s.IsDeleted == false);

            if (pollItemsInDb == null)
                return NotFound();

            pollItemsInDb = _mapper.Map<PollItemDto, PollItem>(pollItemDto);
            var result = await _context.SaveChangesAsync() > 0 ? pollItemsInDb : null;
            return Ok(result);
        }

    }
}
