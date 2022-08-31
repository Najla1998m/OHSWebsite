using API.Data;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class SubscriptionTypesTermController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public SubscriptionTypesTermController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetSubscriptionTypesTerms")]
        public async Task<ActionResult> GetSubscriptionTypesTerms()
        {
            var result = await _context.SubscriptionTypesTerms
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<SubscriptionTypesTerm, SubscriptionTypesTermDto>));
        }

        [HttpGet("GetTermsBySubscriptionTypeId/{id}")]

        public async Task<ActionResult> GetSkillById(int id)
        {
            var subscriptionTypesTerm = await _context.SubscriptionTypesTerms
                                .SingleOrDefaultAsync(s => s.SubscriptionTypeId == id && s.IsDeleted == false);

            if (subscriptionTypesTerm == null) return NotFound();

            return Ok(_mapper.Map<SubscriptionTypesTerm, SubscriptionTypesTermDto>(subscriptionTypesTerm));
        }

        [HttpPost("UpdateSubscriptionTypesTerms")]
        public async Task<ActionResult> UpdateSkill(int id, SubscriptionTypesTermDto subscriptionTypesTermDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var subscriptionTypesTerm = await _context.SubscriptionTypesTerms
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (subscriptionTypesTerm == null)
                return NotFound();

            // subscriptionTypesTerm.SubscriptionTypeId = id;
            // subscriptionTypesTerm.TermsContent = subscriptionTypesTermDto.TermsContent;

            _mapper.Map(subscriptionTypesTermDto, subscriptionTypesTerm);

            return Ok(await _context.SaveChangesAsync() > 0);
        }


        [HttpPost("CreateSubscriptionTypesTerms")]
        public async Task<ActionResult> CreateSubscriptionTypesTerms(SubscriptionTypesTermDto subscriptionTypesTermDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var subscriptionTypesTerm = _mapper.Map<SubscriptionTypesTermDto, SubscriptionTypesTerm>(subscriptionTypesTermDto);
            await _context.SubscriptionTypesTerms.AddAsync(subscriptionTypesTerm);
            await _context.SaveChangesAsync();

            subscriptionTypesTermDto.Id = subscriptionTypesTerm.Id;

            return Ok(subscriptionTypesTermDto);
        }
        [HttpPost("DeleteSubscriptionTypesTerms")]
        public async Task<ActionResult> DeleteSubscriptionTypesTerms(int id)
        {
            var SubscriptionTypesTermsDb = await _context.SubscriptionTypesTerms
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (SubscriptionTypesTermsDb == null) return NotFound();

            SubscriptionTypesTermsDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}
