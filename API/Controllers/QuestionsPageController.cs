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
   
    public class QuestionsPageController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public QuestionsPageController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllQuestionsPage")]
        public async Task<ActionResult> GetAllQuestionsPage()
        {
            var result = await _context.QuestionsPages
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<QuestionsPage, QuestionsPageDto>));
        }
        [HttpGet("GetQuestionsPageById/{id}")]

        public async Task<ActionResult> GetQuestionsPageById(int id)
        {
            var questionsPageInDb = await _context.QuestionsPages
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (questionsPageInDb == null) return NotFound();

            return Ok(_mapper.Map<QuestionsPage, QuestionsPageDto>(questionsPageInDb));
        }
        [HttpPost("UpdateQuestionsPage")]
        public async Task<ActionResult> UpdateQuestionsPage(int id, QuestionsPageDto questionsPageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var questionsPageInDb = await _context.QuestionsPages
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (questionsPageInDb == null)
                return NotFound();

            _mapper.Map(questionsPageDto, questionsPageInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("CreateQuestionsPage")]
        public async Task<ActionResult> CreateQuestionsPage(QuestionsPageDto questionsPageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var questionsPage = _mapper.Map<QuestionsPageDto, QuestionsPage>(questionsPageDto);
            await _context.QuestionsPages.AddAsync(questionsPage);
            await _context.SaveChangesAsync();

            questionsPageDto.Id = questionsPage.Id;

            return Ok(questionsPageDto);
        }
        [HttpPost("DeleteQuestionsPage")]
        public async Task<ActionResult> DeleteQuestionsPage(int id)
        {
            var questionsPageInDb = await _context.QuestionsPages
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (questionsPageInDb == null) return NotFound();

            questionsPageInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}