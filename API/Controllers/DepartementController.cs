using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class DepartementController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public DepartementController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllManagements")]
        public async Task<ActionResult> GetAllManagements()
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId == null)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetAllManagementsByCompanyId")]
        public async Task<ActionResult> GetAllManagementsByCompanyId(int CompanyId)
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId == null && s.CompanyId == CompanyId)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetAllDepartements")]
        public async Task<ActionResult> GetAllDepartements()
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId != null
                                                && s.UnitType == DepartementUnitType.Depts)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetAllDepartementsByCompanyId")]
        public async Task<ActionResult> GetAllDepartementsByCompanyId(int CompanyId)
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId != null
                                                && s.UnitType == DepartementUnitType.Depts
                                                && s.CompanyId == CompanyId)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetAllDepartementsByCompanyIdAndMangmentId")]
        public async Task<ActionResult> GetAllDepartementsByCompanyIdAndMangmentId(int CompanyId, int MangmentId)
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId != null
                                                && s.UnitType == DepartementUnitType.Depts
                                                && s.ParentId == MangmentId
                                                && s.CompanyId == CompanyId)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetAllTeams")]
        public async Task<ActionResult> GetAllTeams()
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId != null
                                                && s.UnitType == DepartementUnitType.Teams)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetAllTeamsByCompanyIdAndDepartmentId")]
        public async Task<ActionResult> GetAllTeamsByCompanyIdAndDepartmentId(int CompanyId, int DepartmentId)
        {
            var result = await _context.Departements
                                    .Where(s => s.IsDeleted == false
                                                && s.ParentId != null
                                                && s.UnitType == DepartementUnitType.Teams
                                                && s.CompanyId == CompanyId
                                                && s.ParentId == DepartmentId)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Departement, DepartementDto>));
        }
        [HttpGet("GetDepartmentsByUserId")]
        public async Task<ActionResult> GetDepartmentsByUserId(string userId)
        {
            var result = await _context.UserDepartments
                                    .Where(s => s.UserId == userId)
                                    .Include(s => s.Departement)
                                    .Include(s => s.User)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<UserDepartments, UserDepartmentsDto>));
        }
        [HttpGet("GetDepartementById/{id}")]

        public async Task<ActionResult> GetDepartementById(int id)
        {
            var departementInDb = await _context.Departements
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (departementInDb == null) return NotFound();

            return Ok(_mapper.Map<Departement, DepartementDto>(departementInDb));
        }
        [HttpPost("UpdateManagment")]
        public async Task<ActionResult> UpdateParentDepartement(int id, DepartementDto departementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (departementDto.ParentId != null)
                return BadRequest("Don't Enter Parent ID");

            var departementByCorrespondingDeptIdInDb = await _context.Departements
                                                     .SingleOrDefaultAsync(s => s.Id == departementDto.CorrespondingDeptId);

            // if (departementByCorrespondingDeptIdInDb == null)
            //     return NotFound("Enter Correct Corresponding Departement Id");

            var departementInDb = await _context.Departements
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (departementInDb == null)
                return NotFound();

            _mapper.Map(departementDto, departementInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("UpdateSubDepartement")]
        public async Task<ActionResult> UpdateSubDepartement(int id, DepartementDto departementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (departementDto.ParentId == null)
                return BadRequest("Enter Parent ID");

            //var departementByCorrespondingDeptIdInDb = await _context.Departements
            //                                .SingleOrDefaultAsync(s => s.Id == departementDto.CorrespondingDeptId);

            //if (departementByCorrespondingDeptIdInDb == null)
            //    return NotFound("Enter Correct Corresponding Departement Id");

            var departementByParentIdInDb = await _context.Departements
                                                        .SingleOrDefaultAsync(s => s.Id == departementDto.ParentId);
            if (departementByParentIdInDb == null)
                return NotFound("Enter Correct Parent Id");

            var departementInDb = await _context.Departements
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (departementInDb == null)
                return NotFound();

            _mapper.Map(departementDto, departementInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("AddManagement")]
        public async Task<ActionResult> AddManagement(DepartementDto departementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            //if (departementDto.ParentId != null)
            //    return BadRequest("Don't Enter Parent ID");

            //var departementByCorrespondingDeptIdInDb = await _context.Departements
            //                                         .SingleOrDefaultAsync(s => s.Id == departementDto.CorrespondingDeptId);

            //if (departementByCorrespondingDeptIdInDb == null)
            //    return NotFound("Enter Correct Corresponding Departement Id");

            var departement = _mapper.Map<DepartementDto, Departement>(departementDto);
            await _context.Departements.AddAsync(departement);
            await _context.SaveChangesAsync();

            departementDto.Id = departement.Id;

            return Ok(departementDto);
        }
        [HttpPost("AddDepartement")]
        public async Task<ActionResult> AddDepartement(DepartementDto departementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (departementDto.ParentId == null)
                return BadRequest("Enter Parent ID");

            //var departementByCorrespondingDeptIdInDb = await _context.Departements
            //                                .SingleOrDefaultAsync(s => s.Id == departementDto.CorrespondingDeptId);

            //if (departementByCorrespondingDeptIdInDb == null)
            //    return NotFound("Enter Correct Corresponding Departement Id");

            var departementByParentIdInDb = await _context.Departements
                                                        .SingleOrDefaultAsync(s => s.Id == departementDto.ParentId);
            if (departementByParentIdInDb == null)
                return NotFound("Enter Correct Parent Id");

            var departement = _mapper.Map<DepartementDto, Departement>(departementDto);

            departement.UnitType = DepartementUnitType.Depts;

            await _context.Departements.AddAsync(departement);
            await _context.SaveChangesAsync();

            departementDto.Id = departement.Id;

            return Ok(departementDto);
        }
        [HttpPost("AddTeam")]
        public async Task<ActionResult> AddTeam(DepartementDto departementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (departementDto.ParentId == null)
                return BadRequest("Enter Parent ID");

            var departementByParentIdInDb = await _context.Departements
                                                        .SingleOrDefaultAsync(s => s.Id == departementDto.ParentId);
            if (departementByParentIdInDb == null)
                return NotFound("Enter Correct Parent Id");

            var departement = _mapper.Map<DepartementDto, Departement>(departementDto);

            departement.UnitType = DepartementUnitType.Teams;

            await _context.Departements.AddAsync(departement);
            await _context.SaveChangesAsync();

            departementDto.Id = departement.Id;

            return Ok(departementDto);
        }

        [HttpPost("DeleteDepartement")]
        public async Task<ActionResult> DeleteDepartement(int id)
        {
            var departementInDb = await _context.Departements
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (departementInDb == null) return NotFound();

            departementInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("ReplaceUserDepartement")]
        public async Task<ActionResult> ReplaceUserDepartement(string userId, int NewDepartmentId, int OldDepartmentId)
        {
            var userDepartments = await _context.UserDepartments.
                Where(x => x.DepartementId == OldDepartmentId && x.UserId == userId).
                FirstOrDefaultAsync();

            if (userDepartments == null) return NotFound();
            _context.UserDepartments.Remove(userDepartments);
            await _context.SaveChangesAsync();
            _context.UserDepartments.Add(new UserDepartments()
            {
                DepartementId = NewDepartmentId,
                UserId = userId
            });
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}