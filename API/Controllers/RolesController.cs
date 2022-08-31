using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    //[Authorize]
    public class RolesController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        public RolesController(DataContext context, RoleManager<AppRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("GetRoles")]
        public async Task<ActionResult<IEnumerable<AppRole>>> GetRoles()
        {
            var roles = await _context.Roles
                            .ToListAsync();

            if (roles.Count == 0) return BadRequest("There is no Roles");


            return Ok(roles);
        }
        [HttpGet("GetParentRoles")]
        public async Task<ActionResult<IEnumerable<AppRole>>> GetParentRoles()
        {
            var roles = await _context.Roles
                                .Where(s => s.ParentId == null)
                                .ToListAsync();

            if (roles.Count == 0) return BadRequest("There is no Roles");


            return Ok(roles);
        }
        [HttpGet("GetChildRoles")]
        public async Task<ActionResult<IEnumerable<AppRole>>> GetChildRoles(string userId)
        {
            // var userId = _userManager.GetUserId(HttpContext.User);
            var user = await _userManager.FindByIdAsync(userId);
            var userRoles = await _userManager.GetRolesAsync(user);
            var roleName = userRoles[0];

            var role = await _context.Roles.SingleOrDefaultAsync(s => s.Name == roleName);

            var roles = await _context.Roles
                                .Where(s => s.ParentId == role.Id)
                                .ToListAsync();

            if (roles.Count == 0) return BadRequest("There is no Roles");


            return Ok(roles);
        }
        [HttpGet("GetChildRolesByParentId")]
        public async Task<ActionResult<IEnumerable<AppRole>>> GetChildRolesByParentId(string parentId)
        {

         
            var roles = await _context.Roles
                                .Where(s => s.ParentId == parentId)
                                .ToListAsync();

            if (roles.Count == 0) return BadRequest("There is no Roles");


            return Ok(roles);
        }
        // [HttpGet]
        // public async Task<ActionResult<PagingSortingFilteringList<RoleDto>>> GetRoles([FromQuery] PagingParams pagingParams, [FromQuery] SortingParams sortingParams, string searchBy)
        // {
        //     // _mapper.ConfigurationProvider.AssertConfigurationIsValid();
        //     //var s = await _userManager.Users.Include(s => s.UserRoles).ThenInclude(a => a.Role).ToListAsync();
        //     var users = await _context.Roles
        //                 .ProjectTo<RoleDto>(_mapper.ConfigurationProvider);


        //     var deserializedString = "";

        //     if (!string.IsNullOrEmpty(sortingParams.SortBy))
        //         deserializedString = JsonConvert.DeserializeObject<string>(sortingParams.SortBy);


        //     switch (deserializedString)
        //     {
        //         case "Name":
        //             if (sortingParams.Order == 1)
        //                 users = users.OrderBy(s => s.Name);
        //             else
        //                 users = users.OrderByDescending(s => s.Name);
        //             break;

        //         default:
        //             users = users.OrderBy(s => s.Name);
        //             break;
        //     }
        //     // if (!string.IsNullOrEmpty(deserializedString) && sortingParams.Order == 1)
        //     //     users = users.OrderBy(s => GetPropertyValue(s, deserializedString));

        //     // if (!string.IsNullOrEmpty(deserializedString) && sortingParams.Order == -1)
        //     //     users = users.OrderByDescending(s => GetPropertyValue(s, deserializedString));

        //     if (!string.IsNullOrEmpty(searchBy))
        //     {
        //         users = users.Where(s => s.Name.Contains(searchBy));
        //     }

        //     return Ok(await PagingSortingFilteringList<UserAdminDto>.CreateAsync(users.AsNoTracking(), pagingParams));

        // }
        [HttpPost("CreateRole")]
        public async Task<ActionResult> CreateRole(RoleDto roleDto)
        {
            var role = new AppRole { Name = roleDto.Name, ParentId = roleDto.ParentId ,NameAR=roleDto.NameAR};

            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded) return Ok(role);

            return BadRequest(result.Errors);
        }
        [HttpPost("EditRole")]
        public async Task<ActionResult> EditRole(RoleDto roleDto)
        {
            var role = await _roleManager.FindByIdAsync(roleDto.Id);

            if (role == null) return NotFound();

            role.Name = roleDto.Name;

            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded) return Ok();

            return BadRequest(result.Errors);
        }
        [HttpPost("DeleteRole")]
        public async Task<ActionResult> DeleteRole(RoleDto roleDto)
        {
            var role = await _roleManager.FindByIdAsync(roleDto.Id);

            if (role == null) return NotFound();

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded) return Ok(result.Succeeded);

            return BadRequest(result.Errors);
        }

    }
}