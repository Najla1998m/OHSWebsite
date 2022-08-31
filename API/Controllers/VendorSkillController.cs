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
    public class VendorSkillController: BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public VendorSkillController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllVendorSkill")]
        public async Task<ActionResult> GetAllVendorSkill()
        {
            var result = await _context.VendorSkills
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<VendorSkill, VendorSkillDto>));
        }
        [HttpGet("GetVendorSkillById/{id}")]

        public async Task<ActionResult> GetVendorSkillById(int id)
        {
            var vendorSkillInDb = await _context.VendorSkills
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (vendorSkillInDb == null) return NotFound();

            return Ok(_mapper.Map<VendorSkill, VendorSkillDto>(vendorSkillInDb));
        }
        [HttpPost("UpdateVendorSkill")]
        public async Task<ActionResult> UpdateVendorSkill(int id, VendorSkillDto vendorSkillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vendorSkillInDb = await _context.VendorSkills
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (vendorSkillInDb == null)
                return NotFound();

            _mapper.Map(vendorSkillDto, vendorSkillInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateVendorSkill")]
        public async Task<ActionResult> CreateVendorSkill(CreateVendorSkillDto vendorSkillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var vendorSkill = _mapper.Map<CreateVendorSkillDto, VendorSkill>(vendorSkillDto);
            await _context.VendorSkills.AddAsync(vendorSkill);
            await _context.SaveChangesAsync();

            // vendorSkillDto.Id = vendorSkill.Id;

            return Ok(vendorSkillDto);
        }

        [HttpPost("DeleteVendorSkill")]
        public async Task<ActionResult> DeleteVendorSkill(int id)
        {
            var vendorSkillInDb = await _context.VendorSkills
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (vendorSkillInDb == null) return NotFound();

            vendorSkillInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}