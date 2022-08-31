using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Admin
{
    public class SubscriptionTypeController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public SubscriptionTypeController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllSubscriptionType")]
        public async Task<ActionResult> GetAllSubscriptionType()
        {

            var SubscriptionTypesWithAttashments = new List<SubscriptionTypesWithAttashments>();
            var res = await _context.SubscriptionTypeAttachmentMappings
                                .Where(x => x.SubscriptionType.IsDeleted == false)
                                .Include(x => x.Attachment)
                                .Include(x => x.SubscriptionType)
                                .ToListAsync();

            if (res == null) return NotFound();

            var result = res.GroupBy(p => p.SubscriptionType,
                                            p => p.Attachment,
                                            (key, g) => new
                                            {
                                                SubscriptionType = _mapper.Map<SubscriptionType, SubscriptionTypeDto>(key),
                                                Attachments = new
                                                {
                                                    Attachments = g.ToList().Select(_mapper.Map<Attachment, AttachmentDto>),
                                                    SubscriptionTypeAttachmentId = key.Id
                                                }
                                            });

            // res.ForEach(a =>
            // {
            //     var aa = res.Where(x => x.SubscriptionTypeId == a.SubscriptionTypeId).
            //         Select(x => new AttachmentItems()
            //         {
            //             SubscriptionTypeAttachmentId = x.Id,
            //             AttachmentListDto = _mapper.Map<Attachment, AttachmentDto>(x.Attachment)

            //         }).ToList();


            //     SubscriptionTypesWithAttashments.Add(new SubscriptionTypesWithAttashments()
            //     {
            //         SubscriptionTypeDto = _mapper.Map<SubscriptionType, SubscriptionTypeDto>(a.SubscriptionType),
            //         AttachmentListDto = aa
            //     });
            // });
            return Ok(result);
        }
        [HttpGet("GetSubscriptionTypeById/{id}")]

        public async Task<ActionResult> GetSubscriptionTypeById(int id)
        {
            var subscriptionTypeInDb = await _context.SubscriptionTypeAttachmentMappings
                                                .Include(x => x.Attachment)
                                                .Include(x => x.SubscriptionType)
                                                .SingleOrDefaultAsync(s => s.Id == id);

            if (subscriptionTypeInDb == null) return NotFound();

            return Ok(_mapper.Map<SubscriptionTypeAttachmentMapping, SubscriptionTypeAttachmentMappingDto>(subscriptionTypeInDb));
        }
        [HttpPost("UpdateSubscriptionType")]
        public async Task<ActionResult> UpdateSubscriptionType(int id, SubscriptionTypeDto subscriptionTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var subscriptionTypeInDb = await _context.SubscriptionTypes
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (subscriptionTypeInDb == null)
                return NotFound();

            _mapper.Map(subscriptionTypeDto, subscriptionTypeInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateSubscriptionType")]
        public async Task<ActionResult> CreateSubscriptionType(SubscriptionTypeDto subscriptionTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var subscriptionType = _mapper.Map<SubscriptionTypeDto, SubscriptionType>(subscriptionTypeDto);
            await _context.SubscriptionTypes.AddAsync(subscriptionType);
            await _context.SaveChangesAsync();

            subscriptionTypeDto.Id = subscriptionType.Id;

            return Ok(subscriptionTypeDto);
        }

        [HttpPost("DeleteSubscriptionType")]
        public async Task<ActionResult> DeleteSubscriptionType(int id)
        {
            var subscriptionTypeInDb = await _context.SubscriptionTypes
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (subscriptionTypeInDb == null) return NotFound();

            subscriptionTypeInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}