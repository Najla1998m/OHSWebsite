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
    public class PackageCriteriaController: BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public PackageCriteriaController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllPackageCriteria")]
        public async Task<ActionResult> GetAllPackageCriteria()
        {
            var result = await _context.PackageCriterias
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<PackageCriteria, PackageCriteriaDto>));
        }
        [HttpGet("GetPackageCriteriaById/{id}")]

        public async Task<ActionResult> GetPackageCriteriaById(int id)
        {
            var packageCriteriaInDb = await _context.PackageCriterias
                                .SingleOrDefaultAsync(s => s.Id == id);

            if (packageCriteriaInDb == null) return NotFound();

            return Ok(_mapper.Map<PackageCriteria, PackageCriteriaDto>(packageCriteriaInDb));
        }
      
    }
}