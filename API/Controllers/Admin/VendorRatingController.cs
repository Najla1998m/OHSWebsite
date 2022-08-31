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
    public class VendorRatingController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public VendorRatingController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllVendorRating")]
        public async Task<ActionResult> GetAllVendorRating()
        {
            var result = await _context.VendorRatings
                                    .Where(s => s.IsDeleted == false)
                                    .Include(s => s.Company)
                                    .Include(s => s.User)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<VendorRating, VendorRatingDto>));
        }
        [HttpGet("GetVendorRatingById/{id}")]

        public async Task<ActionResult> GetVendorRatingById(int id)
        {
            var vendorRatingInDb = await _context.VendorRatings
                                                .Include(s => s.Company)
                                                .Include(s => s.User)
                                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (vendorRatingInDb == null) return NotFound();

            return Ok(_mapper.Map<VendorRating, VendorRatingDto>(vendorRatingInDb));
        }
        [HttpPost("UpdateVendorRating")]
        public async Task<ActionResult> UpdateVendorRating(int id, VendorRatingDto vendorRatingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vendorRatingInDb = await _context.VendorRatings
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (vendorRatingInDb == null)
                return NotFound();

            _mapper.Map(vendorRatingDto, vendorRatingInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateVendorRating")]
        public async Task<ActionResult> CreateVendorRating(VendorRatingDto vendorRatingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vendorRating = _mapper.Map<VendorRatingDto, VendorRating>(vendorRatingDto);
            await _context.VendorRatings.AddAsync(vendorRating);
            await _context.SaveChangesAsync();

            vendorRatingDto.Id = vendorRating.Id;

            return Ok(vendorRatingDto);
        }

        [HttpPost("DeleteVendorRating")]
        public async Task<ActionResult> DeleteVendorRating(int id)
        {
            var vendorRatingInDb = await _context.VendorRatings
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (vendorRatingInDb == null) return NotFound();

            vendorRatingInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}