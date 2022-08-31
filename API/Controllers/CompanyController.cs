using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers.LogError;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class CompanyController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CompanyController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpPost("AddCompany")]

        public async Task<ActionResult> AddCompany(CompanyDto company)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            var _company = _mapper.Map<CompanyDto, Company>(company);

            await _context.Companies.AddAsync(_company);
            await _context.SaveChangesAsync();

            return Ok(_company);
        }


        [HttpGet("GetAllCompanies")]
        public async Task<ActionResult> GetAllCompanies()
        {
            var AllCompanies = await _context.Companies.Where(x => x.IsDeleted == false).ToListAsync();

            return Ok(AllCompanies.Select(_mapper.Map<Company, CompanyDto>));
        }

        [HttpGet("GetCompanyById")]
        public async Task<ActionResult> GetCompanyById(int CompanyId)
        {

            var company = await _context.Companies
                                 .SingleOrDefaultAsync(s => s.Id == CompanyId && s.IsDeleted == false);

            if (company == null) return NotFound();

            return Ok(_mapper.Map<Company, CompanyDto>(company));
        }

        [HttpPost("DeleteCompanyById")]
        public async Task<ActionResult> DeleteCompanyById(int CompanyId)
        {
            var company = await _context.Companies
                                 .SingleOrDefaultAsync(s => s.Id == CompanyId
                                                           && s.IsDeleted == false);
            if (company == null) return NotFound();
            company.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpGet("GetCompanyUserByCompanyId")]
        public async Task<ActionResult> GetCompanyUserByCompanyId(int CompanyId)
        {

            var allUsers = await _context.Users
                                 .Where(s => s.CompanyId == CompanyId && s.IsDeleted == false).ToListAsync();

            if (allUsers == null) return NotFound();

            return Ok(allUsers.Select(_mapper.Map<AppUser, AppUserDto>));
        }

        [HttpGet("GetAllCompaniesAdmin")]
        public async Task<ActionResult> GetAllCompaniesAdmin()
        {

            var allCompaniesAdmin = await _context.Users
                                 .Where(s => s.IsDeleted == false
                                        && s.UserRoles.Any(urm => urm.Role.Name == "Company Admin"))
                                 .Include(s => s.Company)
                                 //  .Select(s => s.Company)
                                 .Distinct()
                                 .ToListAsync();

            if (allCompaniesAdmin == null) return NotFound();


            return Ok(allCompaniesAdmin.Select(_mapper.Map<AppUser, AppUserDto>));
        }
        [HttpGet("GetAllCompanyVendors")]
        public async Task<ActionResult> GetAllCompanyVendors()
        {

            var allCompanyVendors = await _context.Users
                                 .Where(s => s.IsDeleted == false
                                        && s.UserRoles.Any(urm => urm.Role.Name == "Company Vendor"))
                                 .Include(s => s.Company)
                                 //.Select(s => new { s.Company ,s})
                                 .Distinct()
                                 .ToListAsync();

            if (allCompanyVendors == null) return NotFound();

            return Ok(allCompanyVendors.Select(_mapper.Map<AppUser, AppUserDto>));
        }

        [HttpGet("GetAllIndividualVendors")]
        public ActionResult GetAllIndividualVendors()
        {

            var allIndividualVendors = (_context.Users
                                 .Where(s => s.IsDeleted == false
                                        && s.UserRoles.Any(urm => urm.Role.Name == "Individual Vendor"))
                                 .ToList());

            var subscriptionTypeAttachments =  _context.SubscriptionTypeAttachments.ToList();

            allIndividualVendors.ToList().ForEach(u =>
           {
               var userSubscriptionTypeAttachments = subscriptionTypeAttachments.FirstOrDefault(s => s.UserId == u.Id);
               u.UserPhoto = userSubscriptionTypeAttachments != null ? "https://ohsjoeq.com/Images/Clients/" + userSubscriptionTypeAttachments.ImageUrl : null;
           });

            return Ok(allIndividualVendors.Select(_mapper.Map<AppUser, AppUserDto>));
        }
        [HttpGet("GetIndividualVendorDetails")]
        public async Task<ActionResult> GetIndividualVendorDetails(string userId)
        {

            var user = await _context.Users
                                 .SingleOrDefaultAsync(s => s.IsDeleted == false
                                        && s.UserRoles.Any(urm => urm.Role.Name == "Individual Vendor"));


            if (user == null) return NotFound();



            var userAttachmentUploaded = await _context.SubscriptionTypeAttachments
                                                        .Where(s => s.UserId == user.Id && !string.IsNullOrEmpty(s.ImageUrl))
                                                        .Include(s => s.SubscriptionTypeAttachmentMapping)
                                                        .ThenInclude(s => s.Attachment)
                                                        .Select(s => s.SubscriptionTypeAttachmentMapping.Attachment)
                                                        .ToListAsync();



            var tasks = await _context.Tasks
                            .Include(s => s.Departement)
                            .Where(s => s.AssignedToId == userId)
                            .ToListAsync();

            var ratings = await _context.VendorRatings
                                    .Where(s => s.UserId == userId)
                                    .ToListAsync();

            dynamic details = new System.Dynamic.ExpandoObject();
            details.tasks = tasks.Select(_mapper.Map<Tasks, TasksDto>);
            details.attachmensts = userAttachmentUploaded.Select(_mapper.Map<Attachment, AttachmentDto>);
            details.ratings = ratings.Select(_mapper.Map<VendorRating, VendorRatingDto>);
            return Ok(details);
        }


        [HttpGet("GetCompanyAdminDetails")]
        public async Task<ActionResult> GetCompanyAdminDetails(int comapnyId)
        {
            try
            {
                var user = await _context.Users
                                            .Include(s => s.Company)
                                            .Include(s => s.UserRoles)
                                            .ThenInclude(s => s.Role)
                                            .Include(s => s.UserDepartments)
                                            .ThenInclude(s => s.Departement)
                                            .SingleOrDefaultAsync(s => s.IsDeleted == false
                                                   && s.UserRoles.Any(urm => urm.Role.Name == "Company Admin")
                                                   && s.CompanyId == comapnyId);


                if (user == null) return NotFound();



                var userAttachmentUploaded = await _context.SubscriptionTypeAttachments
                                                            .Where(s => s.UserId == user.Id && !string.IsNullOrEmpty(s.ImageUrl))
                                                            .Include(s => s.SubscriptionTypeAttachmentMapping)
                                                            .ThenInclude(s => s.Attachment)
                                                            .Select(s => s.SubscriptionTypeAttachmentMapping.Attachment)
                                                            .ToListAsync();



                var orders = await _context.Orders
                                        .Include(s => s.Owner)
                                        .ThenInclude(s => s.Company)
                                        .Where(s => s.Owner.CompanyId == comapnyId)
                                        .ToListAsync();

                dynamic details = new System.Dynamic.ExpandoObject();
                details.user = _mapper.Map<AppUser, AppUserDto>(user);
                details.attachmensts = userAttachmentUploaded.Select(_mapper.Map<Attachment, AttachmentDto>);
                details.orders = orders.Select(_mapper.Map<Order, OrderDto>);
                return Ok(details);
            }
            catch (System.Exception ex)
            {
                var error = LogError.Error(ex, System.Reflection.MethodBase.GetCurrentMethod().Name);
                return BadRequest(error);
            }



        }
        [HttpGet("GetCompanyVendorDetails")]
        public async Task<ActionResult> GetCompanyVendorDetails(int comapnyId)
        {
            try
            {
                var user = await _context.Users
                               .Include(s => s.Company)
                               .SingleOrDefaultAsync(s => s.IsDeleted == false
                                      && s.UserRoles.Any(urm => urm.Role.Name == "Company Vendor")
                                      && s.CompanyId == comapnyId);


                if (user == null) return NotFound();



                var userAttachmentUploaded = await _context.SubscriptionTypeAttachments
                                                            .Where(s => s.UserId == user.Id && !string.IsNullOrEmpty(s.ImageUrl))
                                                            .Include(s => s.SubscriptionTypeAttachmentMapping)
                                                            .ThenInclude(s => s.Attachment)
                                                            .Select(s => s.SubscriptionTypeAttachmentMapping.Attachment)
                                                            .ToListAsync();



                var orders = await _context.Orders
                                        .Include(s => s.Vendor)
                                        .ThenInclude(s => s.Company)
                                        .Where(s => s.Vendor.CompanyId == comapnyId)
                                        .ToListAsync();

                var offers = await _context.Offers
                                        .Where(s => s.UserId == user.Id)
                                        .ToListAsync();

                dynamic details = new System.Dynamic.ExpandoObject();
                details.offers = offers.Select(_mapper.Map<Offer, OfferDto>);
                details.attachmensts = userAttachmentUploaded.Select(_mapper.Map<Attachment, AttachmentDto>);
                details.orders = orders.Select(_mapper.Map<Order, OrderDto>);
                return Ok(details);
            }
            catch (System.Exception ex)
            {
                var error = LogError.Error(ex, System.Reflection.MethodBase.GetCurrentMethod().Name);
                return BadRequest(error);
            }

        }

        [HttpGet("GetvendorVerified")]
        public async Task<ActionResult> GetvendorVerified(string vendorId)
        {

            var user = await _context.Users
                                 .Include(s => s.Company)
                                 .SingleOrDefaultAsync(s => s.IsDeleted == false
                                        && s.UserRoles.Any(urm => urm.Role.Name == "Company Vendor"
                                                                || urm.Role.Name == "Individual Vendor")
                                        && s.Id == vendorId);

            if (user == null) return NotFound();

            var userDto = _mapper.Map<AppUser, AppUserDto>(user);

            userDto.IsVerified = userDto.IsActive;

            return Ok(userDto);
        }


    }
}
