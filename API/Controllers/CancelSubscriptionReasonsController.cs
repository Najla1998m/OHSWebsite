using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CancelSubscriptionReasonsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CancelSubscriptionReasonsController(DataContext context,
                               IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        [HttpGet("GetAllCancelSubscriptionReasons")]
        public async Task<ActionResult> GetAllCancelSubscriptionReasons()
        {
            var result = await _context.CancelSubscriptionReasons
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<CancelSubscriptionReason, CancelSubscriptionReasonDto>));
        }
        [HttpGet("GetCancelSubscriptionReason/{id}")]

        public async Task<ActionResult> GetCancelSubscriptionReason(int id)
        {
            var cancelSubscriptionReasonInDb = await _context.CancelSubscriptionReasons
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (cancelSubscriptionReasonInDb == null) return NotFound();

            return Ok(_mapper.Map<CancelSubscriptionReason, CancelSubscriptionReasonDto>(cancelSubscriptionReasonInDb));
        }
        [HttpPost("UpdateCancelSubscriptionReason")]
        public async Task<ActionResult> UpdateCancelSubscriptionReason(int id, CancelSubscriptionReasonDto cancelSubscriptionReasonDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var cancelSubscriptionReasonInDb = await _context.CancelSubscriptionReasons
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (cancelSubscriptionReasonInDb == null)
                return NotFound();

            _mapper.Map(cancelSubscriptionReasonDto, cancelSubscriptionReasonInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateCancelSubscriptionReason")]
        public async Task<ActionResult> CreateCancelSubscriptionReason(CancelSubscriptionReasonDto cancelSubscriptionReasonDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var cancelSubscriptionReason = _mapper.Map<CancelSubscriptionReasonDto, CancelSubscriptionReason>(cancelSubscriptionReasonDto);
            await _context.CancelSubscriptionReasons.AddAsync(cancelSubscriptionReason);
            await _context.SaveChangesAsync();

            cancelSubscriptionReasonDto.Id = cancelSubscriptionReason.Id;

            return Ok(cancelSubscriptionReasonDto);
        }

        [HttpPost("DeleteCancelSubscriptionReason")]
        public async Task<ActionResult> DeleteCancelSubscriptionReason(int id)
        {
            var cancelSubscriptionReasonInDb = await _context.CancelSubscriptionReasons
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (cancelSubscriptionReasonInDb == null) return NotFound();

            cancelSubscriptionReasonInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}