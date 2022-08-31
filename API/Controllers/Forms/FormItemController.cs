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
    public class FormItemController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FormItemController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetFormItemById")]
        public async Task<ActionResult> GetFormDataById(int formItemId)
        {
            var result = await _context.FormItems.
                                        Where(s => s.Id == formItemId).

                                        ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<FormItem, FormItemDTO>));
        }

        [HttpGet("GetAllFormItemsByFormId")]
        public async Task<ActionResult> GetAllFormItemsByFormId(int formId)
        {
            var result = await _context.FormItems.
                                        Where(s =>  s.FormId == formId).

                                        ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<FormItem, FormItemDTO>));
        }

        [HttpGet("GetAllFormItems")]
        public async Task<ActionResult> GetAllFormItems()
        {
            var result = await _context.FormItems.
                                       
                                        Include(x=>x.FormItemType).
                                        Include(x => x.Form).
                                        ToListAsync();

            if (result == null) return NotFound();

            result.ForEach(x =>
            {
                x.Form.FormItems = null;
            });

            return Ok(result.Select(_mapper.Map<FormItem, FormItemDTO>));
        }
        [HttpPost("UpdateFormItem")]
        public async Task<ActionResult> UpdateFormItem(FormItemDTO formItemDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var formDb = await _context.FormItems
                                    .SingleOrDefaultAsync(s => s.Id == formItemDTO.Id);

            if (formDb == null)
                return NotFound();

            _mapper.Map(formItemDTO, formDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateFormItem")]
        public async Task<ActionResult> CreateFormItem(FormItemDTO formItemDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var formItem = _mapper.Map<FormItemDTO, FormItem>(formItemDTO);
            await _context.FormItems.AddAsync(formItem);
            await _context.SaveChangesAsync();
            formItemDTO.Id = formItem.Id;
            return Ok(formItemDTO);
        }

        [HttpPost("DeleteFormItem")]
        public async Task<ActionResult> DeleteFormItem(int id)
        {
            var formDb = await _context.FormItems
                                  .SingleOrDefaultAsync(s => s.Id == id );

            if (formDb == null) return NotFound();

            _context.FormItems.Remove(formDb);
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}
