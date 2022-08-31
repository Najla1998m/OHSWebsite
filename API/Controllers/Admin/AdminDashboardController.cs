using API.Data;
using API.DTOs;
using API.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers.Admin
{
    public class AdminDashboardController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public AdminDashboardController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("GetAdminDashbord")]
        public ActionResult GetAdminDashbord()
        {
            AdminDashbordDto adminDashbordDto = new AdminDashbordDto();
            adminDashbordDto.EmployeeCount = _context.Companies.Where(x => x.IsDeleted == false ).Count();
            adminDashbordDto.CompanyCount = _context.Users.Where(x => x.IsDeleted == false && x.CompanyId != 1 && (x.SubscriptionTypeId == 1 || x.SubscriptionTypeId == 17)).Count();
            adminDashbordDto.VendorCount = _context.UserRoles.
                Where(x => (x.Role.Name == RoleName.IndividualVendor || x.Role.Name == RoleName.CompanyVendor) && x.User.IsDeleted == false).
                Count();
            adminDashbordDto.NotesCount = _context.Tasks.Where(x => x.IsDeleted == false).Count();

            //task

            return Ok(adminDashbordDto);
        }
    }
}
