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
    public class SkillController: BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public SkillController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllSkill")]
        public async Task<ActionResult> GetAllSkill()
        {
            var result = await _context.Skills
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Skill, SkillDto>));
        }
        [HttpGet("GetSkillById/{id}")]

        public async Task<ActionResult> GetSkillById(int id)
        {
            var skillInDb = await _context.Skills
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (skillInDb == null) return NotFound();

            return Ok(_mapper.Map<Skill, SkillDto>(skillInDb));
        }
        [HttpPost("UpdateSkill")]
        public async Task<ActionResult> UpdateSkill(int id, SkillDto skillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var skillInDb = await _context.Skills
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (skillInDb == null)
                return NotFound();

            _mapper.Map(skillDto, skillInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateSkill")]
        public async Task<ActionResult> CreateSkill(SkillDto skillDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var skill = _mapper.Map<SkillDto, Skill>(skillDto);
            await _context.Skills.AddAsync(skill);
            await _context.SaveChangesAsync();

            skillDto.Id = skill.Id;

            return Ok(skillDto);
        }

        [HttpPost("DeleteSkill")]
        public async Task<ActionResult> DeleteSkill(int id)
        {
            var skillInDb = await _context.Skills
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (skillInDb == null) return NotFound();

            skillInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}