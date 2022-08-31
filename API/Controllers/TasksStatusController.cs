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
    public class TasksStatusStatusController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public TasksStatusStatusController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllTasksStatus")]
        public async Task<ActionResult> GetAllTasksStatus()
        {
            var result = await _context.TasksStatus
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<TasksStatus, TasksStatusDto>));
        }
        [HttpGet("GetTasksStatusById/{id}")]

        public async Task<ActionResult> GetTasksStatusById(int id)
        {
            var tasksStatusInDb = await _context.TasksStatus
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (tasksStatusInDb == null) return NotFound();

            return Ok(_mapper.Map<TasksStatus, TasksStatusDto>(tasksStatusInDb));
        }
        [HttpPost("UpdateTasksStatus")]
        public async Task<ActionResult> UpdateTasksStatus(int id, TasksStatusDto tasksStatusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var tasksStatusInDb = await _context.TasksStatus
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (tasksStatusInDb == null)
                return NotFound();

            _mapper.Map(tasksStatusDto, tasksStatusInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateTasksStatus")]
        public async Task<ActionResult> CreateTasksStatus(TasksStatusDto tasksStatusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var tasksStatus = _mapper.Map<TasksStatusDto, TasksStatus>(tasksStatusDto);
            await _context.TasksStatus.AddAsync(tasksStatus);
            await _context.SaveChangesAsync();

            tasksStatusDto.Id = tasksStatus.Id;

            return Ok(tasksStatusDto);
        }

        [HttpPost("DeleteTasksStatus")]
        public async Task<ActionResult> DeleteTasksStatus(int id)
        {
            var tasksStatusInDb = await _context.TasksStatus
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (tasksStatusInDb == null) return NotFound();

            tasksStatusInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}