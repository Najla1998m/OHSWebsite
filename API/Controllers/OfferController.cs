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

namespace API.Controllers
{
    public class OfferController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public OfferController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllOffers")]
        public async Task<ActionResult> GetAllOffers()
        {
            var offers = await _context.Offers
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (offers == null) return NotFound();

            return Ok(offers.Select(_mapper.Map<Offer, OfferDto>));
        }
        [HttpGet("GetOfferById/{id}")]

        public async Task<ActionResult> GetOfferById(int id)
        {
            var offerInDb = await _context.Offers
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (offerInDb == null) return NotFound();

            return Ok(_mapper.Map<Offer, OfferDto>(offerInDb));
        }
        [HttpGet("GetAllOffersByUserId/{id}")]

        public async Task<ActionResult> GetAllOffersByUserId(string userId)
        {
            var offerInDb = await _context.Offers
                                .SingleOrDefaultAsync(s => s.UserId == userId && s.IsDeleted == false);

            if (offerInDb == null) return NotFound();

            return Ok(_mapper.Map<Offer, OfferDto>(offerInDb));
        }
        [HttpGet("GetOffersForCategory/{id}")]

        public async Task<ActionResult> GetOffersForCategory(int categoryId)
        {
            var offersInDb = await _context.Offers
                                .Where(s => s.CategoryId == categoryId
                                                        && s.User.UserRoles
                                                            .Any(urm => urm.Role.Name == "Company Vendor"))
                                .ToListAsync();

            if (offersInDb == null || offersInDb.Count == 0) return NotFound();


            return Ok(offersInDb.Select(_mapper.Map<Offer, OfferDto>));
        }
        [HttpPost("UpdateOffer")]
        public async Task<ActionResult> UpdateOffer(int id, OfferDto offerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var offerInDb = await _context.Offers
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (offerInDb == null)
                return NotFound();

            _mapper.Map(offerDto, offerInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateOffer")]
        public async Task<ActionResult> CreateOffer(OfferDto offerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var offer = _mapper.Map<OfferDto, Offer>(offerDto);
            await _context.Offers.AddAsync(offer);
            await _context.SaveChangesAsync();

            offerDto.Id = offer.Id;

            return Ok(offerDto);
        }
        [HttpPost("DeleteOffer")]
        public async Task<ActionResult> DeleteOffer(int id)
        {
            var offerInDb = await _context.Offers
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (offerInDb == null) return NotFound();

            offerInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }


    }
}