using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CategoriesController(DataContext context,
                                IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllCategories")]
        public async Task<ActionResult> GetAllCategories()
        {
            var categories = await _context.Categories
                                    .Where(s => s.IsDeleted == false)
                                    .Include(s => s.Departement)
                                    .ToListAsync();

            if (categories.Count == 0) return NoContent();

            var result = categories
                            .Select(_mapper.Map<Category, CategoryDto>)
                            .ToList();

            return Ok(result);
        }
        [HttpGet("GetCategoriesByDepartmentId")]
        public async Task<ActionResult> GetCategoriesByDepartmentId(int departementId)
        {
            var categories = await _context.Categories
                                    .Where(s => s.IsDeleted == false
                                               && s.DepartementId == departementId)
                                    .Include(s => s.Departement)
                                    .ToListAsync();

            if (categories.Count==0) return NoContent();

            var result = categories
                            .Select(_mapper.Map<Category, CategoryDto>)
                            .ToList();

            return Ok(result);
        }
        [HttpGet("GetSubCategories")]
        public async Task<ActionResult> GetSubCategories(int categoryId)
        {
            var categories = await _context.Categories
                                    .Where(s => s.IsDeleted == false
                                               && s.ParentID == categoryId)
                                    .Include(s => s.Departement)
                                    .ToListAsync();

            if (categories.Count==0) return NoContent();

            var result = categories
                            .Select(_mapper.Map<Category, CategoryDto>)
                            .ToList();

            return Ok(result);
        }
        [HttpPost("UpdateParentCategory")]
        public async Task<ActionResult> UpdateParentCategory(int id, CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //if (categoryDto.ParentID != null)
            //    return BadRequest("Don't Enter Parent ID");



            var categoryInDb = await _context.Categories
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (categoryInDb == null)
                return NotFound();

            _mapper.Map(categoryDto, categoryInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("UpdateSubCategory")]
        public async Task<ActionResult> UpdateSubCategory(int id, CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (categoryDto.ParentID == null)
                return BadRequest("Enter Parent ID");



            var categoryByParentIdInDb = await _context.Categories
                                                        .SingleOrDefaultAsync(s => s.Id == categoryDto.ParentID);
            if (categoryByParentIdInDb == null)
                return NotFound("Enter Correct Parent Id");

            var categoryInDb = await _context.Categories
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (categoryInDb == null)
                return NotFound();

            _mapper.Map(categoryDto, categoryInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("AddParentCategories")]
        public async Task<ActionResult> AddParentCategories(CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (categoryDto.ParentID != null)
                return BadRequest("Don't Enter Parent ID");

            var category = _mapper.Map<CategoryDto, Category>(categoryDto);
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            categoryDto.Id = category.Id;

            return Ok(categoryDto);
        }
        [HttpPost("AddSubCategories")]
        public async Task<ActionResult> AddSubCategories(CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //if (categoryDto.ParentID == null)
            //    return BadRequest("Enter Parent ID");

            var category = _mapper.Map<CategoryDto, Category>(categoryDto);
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            categoryDto.Id = category.Id;

            return Ok(categoryDto);
        }
        [HttpPost("DeleteCategory")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var categoryInDb = await _context.Categories
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (categoryInDb == null) return NotFound();

            categoryInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }

    }
}