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
    public class FormOptionSetController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FormOptionSetController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetFormOptionSetById")]
        public async Task<ActionResult> GetFormOptionSetById(int formOptionSetId)
        {
            var result = await _context.FormOptionSets.
                                        Where(s => s.Id == formOptionSetId).
                                        Include(x => x.FormOptionSetItems).
                                        ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<FormOptionSet, FormOptionSetDTO>));
        }

        [HttpGet("GetAllFormOptionSetByFormId")]
        public async Task<ActionResult> GetAllFormOptionSetByFormId(int formId)
        {

            var res = await (from formitems in _context.FormItems
                             join form in _context.Forms on formitems.FormId equals form.Id
                             join formOptionSet in _context.FormOptionSets.Include(x => x.FormOptionSetItems) on formitems.FormOptionSetId equals formOptionSet.Id
                             where form.Id == formId
                             select
                               formOptionSet).ToListAsync();

            if (res == null) return NotFound();

            return Ok(res.Select(_mapper.Map<FormOptionSet, FormOptionSetDTO>));
        }
        [HttpGet("GetAllFormOptionSet")]
        public async Task<ActionResult> GetAllFormOptionSet()
        {

            var res = await _context.FormOptionSets.

                Include(x => x.FormOptionSetItems).
                ToListAsync();

            if (res == null) return NotFound();

            return Ok(res.Select(_mapper.Map<FormOptionSet, FormOptionSetDTO>));
        }

        [HttpPost("UpdateFormOptionSet")]
        public async Task<ActionResult> UpdateFormOptionSet(FormOptionSetDTO formOptionSetDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var formOptionSetDb = await _context.FormOptionSets
                                    .SingleOrDefaultAsync(s => s.Id == formOptionSetDTO.Id);

            if (formOptionSetDb == null)
                return NotFound();

            _mapper.Map(formOptionSetDTO, formOptionSetDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateFormOptionSet")]
        public async Task<ActionResult> CreateFormOptionSet(FormOptionSetDTO formOptionSetDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var formOptionSet = _mapper.Map<FormOptionSetDTO, FormOptionSet>(formOptionSetDTO);
            await _context.FormOptionSets.AddAsync(formOptionSet);
            await _context.SaveChangesAsync();

            formOptionSetDTO.Id = formOptionSet.Id;

            return Ok(formOptionSetDTO);
        }

        [HttpPost("DeleteFormOptionSet")]
        public async Task<ActionResult> DeleteFormOptionSet(int id)
        {
            var formDb = await _context.FormOptionSets
                                  .SingleOrDefaultAsync(s => s.Id == id);

            if (formDb == null) return NotFound();

            _context.FormOptionSets.Remove(formDb);
            return Ok(await _context.SaveChangesAsync() > 0);
        }

    }
}
