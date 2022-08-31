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
    public class TasksLevelsContoller: BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public TasksLevelsContoller(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllTasksLevels")]
        public async Task<ActionResult> GetAllTasksLevels()
        {
            var result = await _context.TasksLevels
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<TasksLevel, TasksLevelDto>));
        }
        [HttpGet("GetTasksLevelsById/{id}")]

        public async Task<ActionResult> GetTasksLevelsById(int id)
        {
            var tasksLevelInDb = await _context.TasksLevels
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (tasksLevelInDb == null) return NotFound();

            return Ok(_mapper.Map<TasksLevel, TasksLevelDto>(tasksLevelInDb));
        }
        [HttpPost("UpdateTasksLevels")]
        public async Task<ActionResult> UpdateTasksLevels(int id, TasksLevelDto tasksLevelDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var tasksLevelInDb = await _context.TasksLevels
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (tasksLevelInDb == null)
                return NotFound();

            _mapper.Map(tasksLevelDto, tasksLevelInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateTasksLevels")]
        public async Task<ActionResult> CreateTasksLevels(TasksLevelDto tasksLevelDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var tasksLevel = _mapper.Map<TasksLevelDto, TasksLevel>(tasksLevelDto);
            await _context.TasksLevels.AddAsync(tasksLevel);
            await _context.SaveChangesAsync();

            tasksLevelDto.Id = tasksLevel.Id;

            return Ok(tasksLevelDto);
        }

        [HttpPost("DeleteTasksLevels")]
        public async Task<ActionResult> DeleteTasksLevels(int id)
        {
            var tasksLevelInDb = await _context.TasksLevels
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (tasksLevelInDb == null) return NotFound();

            tasksLevelInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}