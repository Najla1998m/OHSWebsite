using API.Data;
using API.DTOs.Forms;
using API.Entities;
using API.Entities.Forms;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
namespace API.Controllers.Forms
{
    public class FormController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FormController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetFormDataById")]
        public async Task<ActionResult> GetFormDataById(int formId)
        {
            var result = await _context.Forms.
                                            Where(s => s.Id == formId).
                                            Include(x => x.Departement).
                                            Include(x => x.FormItems).
                                            ThenInclude(x => x.FormItemType).
                                            Include(x => x.FormItems).
                                            ThenInclude(x => x.FormOptionSet).
                                            ThenInclude(x => x.FormOptionSetItems).
                                            ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Form, FormDTO>));
        }
        [HttpGet("GetAllForms")]
        public async Task<ActionResult> GetAllForms()
        {
            var result = await _context.Forms.

                                            Include(x => x.Departement).
                                            Include(x => x.FormItems).
                                            ThenInclude(x => x.FormItemType).
                                            Include(x => x.FormItems).
                                            ThenInclude(x => x.FormOptionSet).
                                            ThenInclude(x => x.FormOptionSetItems).
                                            ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Form, FormDTO>));
        }

        [HttpGet("GetAllFormsByDepartementId")]
        public async Task<ActionResult> GetAllFormsByDepartementId(int departementId)
        {
            var result = await _context.Forms.
                                            Where(s => s.DepartementId == departementId).
                                            Include(x => x.Departement).
                                            Include(x => x.FormItems).
                                            ThenInclude(x => x.FormItemType).
                                            Include(x => x.FormItems).
                                            ThenInclude(x => x.FormOptionSet).
                                            ThenInclude(x => x.FormOptionSetItems).
                                            ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Form, FormDTO>));
        }

        [HttpPost("UpdateForm")]
        public async Task<ActionResult> UpdateForm(FormDTO formDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var formDb = await _context.Forms
                                    .SingleOrDefaultAsync(s => s.Id == formDTO.Id);

            if (formDb == null)
                return NotFound();

            _mapper.Map(formDTO, formDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateForm")]
        public async Task<ActionResult> CreateForm(FormDTO formDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var form = _mapper.Map<FormDTO, Form>(formDTO);
            await _context.Forms.AddAsync(form);
            await _context.SaveChangesAsync();

            formDTO.Id = form.Id;

            return Ok(formDTO);
        }
        [HttpPost("DeleteForm")]
        public async Task<ActionResult> DeleteForm(int id)
        {
            var formDb = await _context.Forms
                                  .SingleOrDefaultAsync(s => s.Id == id);

            if (formDb == null) return NotFound();

            var tasks = await _context.Tasks.Where(x => x.FormId == id).ToListAsync();
            var notifications = await _context.Notifications.Where(x => tasks.Select(x => x.Id).ToList().Contains(x.TasksId.Value)).ToListAsync();
            var formItems = await _context.FormItems.Where(x => x.FormId==id).ToListAsync();


            try
            {
                _context.FormItems.RemoveRange(formItems);
                _context.Notifications.RemoveRange(notifications);
                _context.Tasks.RemoveRange(tasks);
            }
            catch (Exception)
            {

                throw;
            }
            _context.Forms.Remove(formDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

    }
}
