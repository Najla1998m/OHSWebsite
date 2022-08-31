using System;
using System.Collections.Generic;
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

    public class DepartmentTypeRoleController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public DepartmentTypeRoleController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("GetRolesForDeptType")]
        public async Task<ActionResult> GetRolesForDeptType(string deptType)
        {
            var result = await _context.DepartmentTypeRoles.
                            Where(x => x.DepartmentType == deptType && x.IsDeleted == false).
                            Include(x=>x.AppRole).
                            ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<DepartmentTypeRole, DepartmentTypeRoleDTO>));
        }
        [HttpPost("CreateDepartmentRole")]
        public async Task<ActionResult> CreateDepartmentRole(DeptTypeDTO deptType)
        {

            var TempList = new List<DepartmentTypeRole>();
            deptType.RoleIds.ForEach(x =>
           {
               TempList.Add(new DepartmentTypeRole()
               {
                   AppRoleId = x,
                   DepartmentType = deptType.DeptType
               });
           });
            await _context.DepartmentTypeRoles.AddRangeAsync(TempList);
            await _context.SaveChangesAsync();
            return Ok(TempList);
        }

        [HttpPost("DeleteDepartmentRole")]
        public async Task<ActionResult> DeleteDepartmentRole(int Id)
        {
            var DepartmentRoleDb = await _context.DepartmentTypeRoles
                                 .SingleOrDefaultAsync(s => s.Id == Id && s.IsDeleted == false);

            if (DepartmentRoleDb == null) return NotFound();

            DepartmentRoleDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}
