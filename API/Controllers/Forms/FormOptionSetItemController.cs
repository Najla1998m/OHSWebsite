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
    public class FormOptionSetItemItemController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FormOptionSetItemItemController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetFormOptionSetItemById")]
        public async Task<ActionResult> GetFormOptionSetItemById(int FormOptionSetItemId)
        {
            var result = await _context.FormOptionSetItems.
                                        Where(s => s.Id == FormOptionSetItemId).
                                        ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<FormOptionSetItem, FormOptionSetItemDTO>));
        }

        [HttpPost("UpdateFormOptionSetItem")]
        public async Task<ActionResult> UpdateFormOptionSetItem(FormOptionSetItemDTO FormOptionSetItemDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var FormOptionSetItemDb = await _context.FormOptionSetItems
                                    .SingleOrDefaultAsync(s => s.Id == FormOptionSetItemDTO.Id );

            if (FormOptionSetItemDb == null)
                return NotFound();

            _mapper.Map(FormOptionSetItemDTO, FormOptionSetItemDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateFormOptionSetItem")]
        public async Task<ActionResult> CreateFormOptionSetItem(FormOptionSetItemDTO FormOptionSetItemDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var FormOptionSetItem = _mapper.Map<FormOptionSetItemDTO, FormOptionSetItem>(FormOptionSetItemDTO);
            await _context.FormOptionSetItems.AddAsync(FormOptionSetItem);
            await _context.SaveChangesAsync();

            FormOptionSetItemDTO.Id = FormOptionSetItem.Id;

            return Ok(FormOptionSetItemDTO);
        }

        [HttpPost("DeleteFormOptionSetItem")]
        public async Task<ActionResult> DeleteFormOptionSetItem(int id)
        {
            var formDb = await _context.FormOptionSetItems
                                  .SingleOrDefaultAsync(s => s.Id == id);

            if (formDb == null) return NotFound();

            _context.FormOptionSetItems.Remove(formDb);
            return Ok(await _context.SaveChangesAsync() > 0);
        }

    }
}
