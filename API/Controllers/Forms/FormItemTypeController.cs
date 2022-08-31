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
    public class FormItemTypeController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FormItemTypeController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetFormItemTypeById")]
        public async Task<ActionResult> GetFormItemTypeById(int formItemTypeId)
        {
            var result = await _context.FormItemTypes.
                                        Where(s => s.Id == formItemTypeId).
                                        ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<FormItemType, FormItemTypeDTO>));
        }

        [HttpGet("GetAllFormItemTypes")]
        public async Task<ActionResult> GetAllFormItemTypes()
        {
            var result = await _context.FormItemTypes.
                                     
                                        ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<FormItemType, FormItemTypeDTO>));
        }

        [HttpPost("UpdateFormItemType")]
        public async Task<ActionResult> UpdateFormItemType(FormItemTypeDTO formItemTypeDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var formItemTypeDb = await _context.FormItemTypes
                                    .SingleOrDefaultAsync(s => s.Id == formItemTypeDTO.Id );

            if (formItemTypeDb == null)
                return NotFound();

            _mapper.Map(formItemTypeDTO, formItemTypeDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateFormItemType")]
        public async Task<ActionResult> CreateFormItemType(FormItemTypeDTO formItemTypeDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var formItemType = _mapper.Map<FormItemTypeDTO, FormItemType>(formItemTypeDTO);
            await _context.FormItemTypes.AddAsync(formItemType);
            await _context.SaveChangesAsync();

            formItemTypeDTO.Id = formItemType.Id;

            return Ok(formItemTypeDTO);
        }

        [HttpPost("DeleteFormItemType")]
        public async Task<ActionResult> DeleteFormItemType(int id)
        {
            var formDb = await _context.FormItemTypes
                                  .SingleOrDefaultAsync(s => s.Id == id);

            if (formDb == null) return NotFound();
            _context.FormItemTypes.Remove(formDb);
          
            return Ok(await _context.SaveChangesAsync() > 0);
        }

    }
}
