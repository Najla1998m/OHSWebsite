using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Helpers.EmailTemplates;
using API.Helpers.LogError;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace API.Controllers
{
    public class UsersController : BaseApiController, IDisposable
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IQRCodeCreation _qRCodeCreation;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMailer _mailer;
        private readonly IImageConversion _imageConversion;
        private readonly IOptions<SmtpSettings> smtSettings;

        public UsersController(DataContext context,
                                IMapper mapper,
                                UserManager<AppUser> userManager,
                                IMailer mailer,
                                IQRCodeCreation qRCodeCreation, IImageConversion imageConversion, IOptions<SmtpSettings> _smtSettings)
        {
            _mailer = mailer;
            _userManager = userManager;
            _mapper = mapper;
            _context = context;
            _qRCodeCreation = qRCodeCreation;
            _imageConversion = imageConversion;
            smtSettings = _smtSettings;
        }

        [HttpGet("GetUsers")]
        public async Task<ActionResult<PagingSortingFilteringList<AppUserDto>>> GetUsers([FromQuery] PagingParams pagingParams, [FromQuery] SortingParams sortingParams, string searchBy)
        {
            // _mapper.ConfigurationProvider.AssertConfigurationIsValid();
            //var s = await _userManager.Users.Include(s => s.UserRoles).ThenInclude(a => a.Role).ToListAsync();
            var users = _context.AppUsers
                        .Where(s => s.IsDeleted == false)
                        .Include(s => s.UserRoles)
                        .ThenInclude(a => a.Role)
                        .Include(s => s.UserDepartments)
                        .ThenInclude(a => a.Departement)
                        .ProjectTo<AppUserDto>(_mapper.ConfigurationProvider);


            var deserializedString = "";

            if (!string.IsNullOrEmpty(sortingParams.SortBy))
                deserializedString = JsonConvert.DeserializeObject<string>(sortingParams.SortBy);


            switch (deserializedString)
            {
                case "Username":
                    if (sortingParams.Order == 1)
                        users = users.OrderBy(s => s.Username);
                    else
                        users = users.OrderByDescending(s => s.Username);
                    break;
                case "Email":
                    if (sortingParams.Order == 1)
                        users = users.OrderBy(s => s.Email);
                    else
                        users = users.OrderByDescending(s => s.Email);
                    break;
                default:
                    users = users.OrderBy(s => s.Username);
                    break;
            }
            // if (!string.IsNullOrEmpty(deserializedString) && sortingParams.Order == 1)
            //     users = users.OrderBy(s => GetPropertyValue(s, deserializedString));

            // if (!string.IsNullOrEmpty(deserializedString) && sortingParams.Order == -1)
            //     users = users.OrderByDescending(s => GetPropertyValue(s, deserializedString));

            if (!string.IsNullOrEmpty(searchBy))
            {
                users = users.Where(s => s.Username.Contains(searchBy)
                                        || s.Email.Contains(searchBy));
            }

            return Ok(await PagingSortingFilteringList<AppUserDto>.CreateAsync(users.AsNoTracking(), pagingParams));

        }
        [HttpGet("GetAllUsersByDepartementId")]
        public async Task<ActionResult<UserDepartmentsDto>> GetAllUsersByDepartementId(int departementId)
        {
            // var result = await _context.UserDepartments
            //                         .Where(x => x.DepartementId == departementId)
            //                         .Include(s => s.Departement)
            //                         .Include(s => s.User)
            //                         .Select(x => x.User)
            //                         .ToListAsync();

            var result = await _context.Users
                         .Where(x => x.IsDeleted == false)
                        .Include(s => s.Company)
                        .Include(s => s.UserRoles)
                        .ThenInclude(s => s.Role)
                        .Include(s => s.UserDepartments)
                        .ThenInclude(s => s.Departement)
                        .Where(s => s.UserDepartments.Any(s => s.DepartementId == departementId))
                        .ToListAsync();


            return Ok(result.Select(_mapper.Map<AppUser, AppUserDto>));
        }

        [HttpGet("GetEmployeeInDept")]
        public async Task<ActionResult> GetEmployeeInDept(string userId, int? companyId)
        {

            if (companyId != null && companyId == 1)
            {
                var customercarerole = await _context.Roles.
                   Where(x => x.Name == RoleName.OHSCustomerCare).
                   FirstOrDefaultAsync();
                //get Customer Care Id
                var customercareroleid = customercarerole.Id;
                //Get Customer Care Team Manger
                var result = await _context.UserRoles.
                    Where(x => x.RoleId == customercareroleid).
                    Include(x => x.User).
                    ThenInclude(x => x.UserDepartments).
                    ThenInclude(x => x.Departement).
                    Include(x => x.Role).
                    Where(x => x.User.IsTeamManager == true).
                    FirstOrDefaultAsync();
                if (result == null) return BadRequest();
                var displayname = GetRoleARName(result.Role.Name) + " - " + result.User.UserDepartments.FirstOrDefault().Departement.Name + " - " + result.User.FullName;
                var user = _mapper.Map<AppUser, AppUserDto>(result.User);
                user.DisplayName = displayname;
                return Ok(user);
            }
            try
            {

                var user = await _context.Users
                            .Where(x => x.IsDeleted == false && x.Id == userId)
                            .Include(s => s.UserDepartments)
                            .ThenInclude(x => x.Departement)
                            .Include(s => s.UserRoles)
                            .ThenInclude(s => s.Role)
                            .FirstOrDefaultAsync();

                var departmentId = user.UserDepartments.FirstOrDefault().DepartementId;

                if (user.UserRoles.FirstOrDefault().Role.Name == RoleName.CompanyDelegatedAdmin ||
                    user.UserRoles.FirstOrDefault().Role.Name == RoleName.CompanyAdmin)
                {
                    var alllManagersInCompany = await _context.AppUsers
                                                .Where(x => x.IsDeleted == false &&
                                                       x.CompanyId == user.CompanyId &&
                                                       x.UserRoles.Any(urm => urm.Role.Name == "Company Supervisor" ||
                                                                       urm.Role.Name == "Company Departement Manager"))
                                                .Include(s => s.UserDepartments)
                                                .ThenInclude(s => s.Departement)
                                                .Include(s => s.UserRoles)

                                                .ThenInclude(a => a.Role)

                                                .ToListAsync();

                    var alllManagersInCompanyRes = alllManagersInCompany.Select(x => new { User = _mapper.Map<AppUser, AppUserDto>(x), DisplayName = GetRoleARName(x.UserRoles.FirstOrDefault().Role.Name) + " - " + x.UserDepartments.FirstOrDefault().Departement.Name + " - " + x.FullName }).ToList();

                    alllManagersInCompanyRes.ForEach(x =>
                    {
                        x.User.DisplayName = x.DisplayName;
                    });

                    var alllManagersInCompanyResfinal = alllManagersInCompanyRes.Select(x => x.User).ToList();

                    return Ok(alllManagersInCompanyResfinal);
                }


                if (user.UserRoles.FirstOrDefault().Role.Name != RoleName.CompanyDepartementManager)
                {
                    var TopMangement = await _context.Departements.Where(x => x.Id == user.UserDepartments.FirstOrDefault().Departement.ParentId).FirstOrDefaultAsync();
                    departmentId = TopMangement.Id;
                }

                var result = await _context.Departements.FromSqlRaw(@";WITH Recursives AS (
                                                                    SELECT *
                                                                    FROM    Departements d
                                                                    WHERE   d.id = " + departmentId + @"
                                                                    UNION ALL
                                                                    SELECT  d2.*
                                                                    FROM     Departements d2 INNER JOIN
                                                                            Recursives r    ON  d2.ParentId = r.Id
                                                                    )
                                                                    SELECT*
                                                                    FROM    Recursives"
                                                            ).ToListAsync();

                var subdepartmentIdList = result.Select(x => x.Id).Distinct().ToList();
                subdepartmentIdList.Add(user.UserDepartments.FirstOrDefault().DepartementId);
                var finalresult = await _context.UserDepartments
                           .Where(x => subdepartmentIdList.Contains(x.DepartementId))
                           .Include(x => x.Departement)
                           .Include(x => x.User.UserDepartments)
                           .Include(x => x.User)
                           .ThenInclude(x => x.UserRoles)
                           .ThenInclude(x => x.Role)
                           .Select(x => new { User = x.User, Departement = x.Departement })
                           .Where(x => x.User.IsDeleted == false && x.User.Id != user.Id)
                           .ToListAsync();
                var res = finalresult.Select(x => new { User = _mapper.Map<AppUser, AppUserDto>(x.User), DisplayName = GetRoleARName(x.User.UserRoles.FirstOrDefault().Role.Name) + " - " + x.Departement.Name + " - " + x.User.FullName }).ToList();
                res.ForEach(x =>
                {

                    x.User.DisplayName = x.DisplayName;

                });
                var final = res.Select(x => x.User).ToList();
                return Ok(final);
            }
            catch (Exception)
            {

                return BadRequest("Invalid User Id");
            }
        }
        private string GetRoleARName(string roleName)
        {
            var name = roleName + Environment.NewLine;

            switch (roleName)
            {
                case RoleName.CompanyAdmin:
                    name = "Company Admin";
                    break;
                case RoleName.CompanyVendor:
                    name = "Company Vendor";
                    break;
                case RoleName.IndividualVendor:
                    name = "Individual Vendor";
                    break;
                case RoleName.CompanyDepartementManager:
                    name = "مدير ادارة";
                    break;
                case RoleName.CompanySupervisor:
                    name = "مدير قسم";
                    break;
                case RoleName.CompanyEmployee:
                    name = "موظف";
                    break;
                default:
                    break;
            }

            return name;
        }
        [HttpGet("GetRiskEvaluationMembers")]
        public async Task<ActionResult> GetRiskEvaluationMembers(string userId)
        {

            var user = await _context.AppUsers
                        .Where(x => x.Id == userId && x.IsDeleted == false).
                        Include(x => x.UserDepartments).
                        FirstOrDefaultAsync();

            if (user == null) return BadRequest();

            var riskEvaluationDepartment = await _context.Departements.
                Where(x => x.ParentId == user.UserDepartments.FirstOrDefault().DepartementId).
                FirstOrDefaultAsync();
            if (riskEvaluationDepartment != null)
            {
                //var users = await _context.UserDepartments.
                //    Where(x => x.DepartementId == riskEvaluationDepartment.Id).
                //    Include(x => x.User).
                //    Select(x => x.User).
                //    ToListAsync();




                var result = await _context.Departements.FromSqlRaw(@";WITH Recursives AS (
                                                                SELECT *
                                                                FROM    Departements d
                                                                WHERE   d.id = " + riskEvaluationDepartment.Id + @"
                                                                UNION ALL
                                                                SELECT  d2.*
                                                                FROM     Departements d2 INNER JOIN
                                                                        Recursives r    ON  d2.ParentId = r.Id
                                                                )
                                                                SELECT*
                                                                FROM    Recursives"
                                                           ).ToListAsync();

                var subdepartmentIdList = result.Select(x => x.Id).Distinct().ToList();
                subdepartmentIdList.Add(user.UserDepartments.FirstOrDefault().DepartementId);

                var finalresult = await _context.UserDepartments
                          .Where(x => subdepartmentIdList.Contains(x.DepartementId))
                          .Include(x => x.Departement)
                          .Include(x => x.User)
                          .ThenInclude(x => x.UserRoles)
                          .ThenInclude(x => x.Role)
                          .Select(x => new { User = x.User, Departement = x.Departement })
                          .Where(x => x.User.IsDeleted == false && x.User.Id != user.Id)
                          .ToListAsync();
                var res = finalresult.Select(x => new { User = _mapper.Map<AppUser, AppUserDto>(x.User), DisplayName = GetRoleARName(x.User.UserRoles.FirstOrDefault().Role.Name) + " - " + x.Departement.Name + " - " + x.User.FullName }).ToList();
                res.ForEach(x =>
                {
                    x.User.DisplayName = x.DisplayName;
                });
                var final = res.Select(x => x.User).ToList();
                return Ok(final);
            }
            else
            {
                return BadRequest("No Risk Evaluation Department Found");
            }
        }

        [HttpGet("GetAllUsersByMangementId")]
        public async Task<ActionResult<UserDepartmentsDto>> GetAllUsersByMangementId(int MangementId)
        {
            var result = await _context.Users.Where(x => x.IsDeleted == false)
                        .Include(s => s.Company)
                        .Include(s => s.UserRoles)
                        .ThenInclude(s => s.Role)
                        .Include(s => s.UserDepartments)
                        .ThenInclude(s => s.Departement)
                        .Where(s => s.UserDepartments.Any(s => s.DepartementId == MangementId))
                        .ToListAsync();


            return Ok(result.Select(_mapper.Map<AppUser, AppUserDto>));
        }


        private static AppUserDto GetPropertyValue(AppUserDto obj, string property)
        {
            System.Reflection.PropertyInfo propertyInfo = obj.GetType().GetProperty(property);
            return (AppUserDto)propertyInfo.GetValue(obj, null);
        }

        [HttpPost("AddDepartementToUser")]
        public async Task<ActionResult<UserDepartmentsDto>> AddDepartementToUser(AddDepartmentToUserDto userDepartmentsDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            try
            {
                var userDepartments = _mapper.Map<AddDepartmentToUserDto, UserDepartments>(userDepartmentsDto);

                await _context.UserDepartments.AddAsync(userDepartments);
                await _context.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                var error = LogError.Error(ex, System.Reflection.MethodBase.GetCurrentMethod().Name);
                return BadRequest(error);
                // return BadRequest(ex.InnerException.Message);
            }


            // userDepartmentsDto.Id = userDepartments.Id;

            return Ok(userDepartmentsDto);
        }
        [HttpPost("AddDepartementToUserByDepartementId")]
        public async Task<ActionResult<UserDepartmentsDto>> AddDepartementToUserByDepartementId(int departementId, string userId)
        {
            if (!ModelState.IsValid) return BadRequest();

            var userDepartments = new UserDepartments { DepartementId = departementId, UserId = userId };
            try
            {
                await _context.UserDepartments.AddAsync(userDepartments);
                await _context.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }


            var userDepartmentsDto = _mapper.Map<UserDepartments, UserDepartmentsDto>(userDepartments);
            // userDepartmentsDto.Id = userDepartments.Id;

            return Ok(userDepartmentsDto);
        }


        [HttpGet("GetUsersById/{id}")]
        public async Task<ActionResult<AppUser>> GetUsersById(string id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == id
                                                                    && x.IsDeleted == false);

            if (user == null) return NotFound();

            return Ok(user);
        }
        [HttpGet("GetUserDetails/{id}")]
        public async Task<ActionResult<UserAttachmentsDto>> GetUserDetails(string id)
        {
            var userAttachmentsDto = new UserAttachmentsDto();

            var user = await _context.AppUsers
                                .Include(s => s.Company)
                                .Include(s => s.SubscriptionType)
                                .Include(s => s.UserDepartments)
                                .ThenInclude(x => x.Departement)
                                .Include(s => s.UserRoles)
                                .ThenInclude(s => s.Role)
                                .SingleOrDefaultAsync(x => x.Id == id
                                                        && x.IsDeleted == false);



            if (user == null) return NotFound();




            var ratings = await _context.VendorRatings
                                 .Include(s => s.Company)
                                 .Where(s => s.UserId == user.Id)
                                 .Select(s => _mapper.Map<VendorRating, VendorRatingDto>(s))
                                 .ToListAsync();

            var skills = await _context.VendorSkills
                                .Include(s => s.Skill)
                                 .Where(s => s.UserId == user.Id)
                                 .Select(s => _mapper.Map<VendorSkill, UserDetailsSkillsDto>(s))
                                 .ToListAsync();

            userAttachmentsDto.VendorRatings = ratings;
            userAttachmentsDto.VendorSkills = skills;


            var userDto = _mapper.Map<AppUser, AppUserDto>(user);
            try
            {
                if (userDto.UserDepartments.FirstOrDefault().Departement.UnitType == DepartementUnitType.Teams)
                {
                    //get mangement 
                    var mangment = _context.Departements.
                        Where(x => x.Id == userDto.UserDepartments.FirstOrDefault().Departement.ParentId).
                        FirstOrDefault();
                    var department = _context.Departements.
                        Where(x => x.Id == mangment.ParentId).
                        FirstOrDefault();
                    userDto.UserDepartments.FirstOrDefault().CorrespondingDeptId = department.CorrespondingDeptId;
                }
                else if (userDto.UserDepartments.FirstOrDefault().Departement.CorrespondingDeptId != null)
                {
                    userDto.UserDepartments.FirstOrDefault().CorrespondingDeptId = userDto.UserDepartments.FirstOrDefault().Departement.CorrespondingDeptId;
                }
                else if (userDto.UserDepartments.FirstOrDefault().Departement.UnitType == DepartementUnitType.Depts)
                {
                    var department = _context.Departements.
                     Where(x => x.Id == userDto.UserDepartments.FirstOrDefault().Departement.ParentId).
                     FirstOrDefault();
                    userDto.UserDepartments.FirstOrDefault().CorrespondingDeptId = department.CorrespondingDeptId;
                }

            }
            catch (Exception)
            {


            }

            userDto.UserDepartments.ForEach(e =>
        {
            //  e.CorrespondingDeptId = e.Departement.CorrespondingDeptId;
            e.Departement = null;

        });


            if (user.UserRoles.Any(urm => urm.Role.Name == "Company Employee" || urm.Role.Name == "Company Delegated Admin"))
            {
                userDto.AllAttachmentsUploaded = true;
                userAttachmentsDto.User = userDto;
                return Ok(userAttachmentsDto);
            }

            if (user.UserRoles.Any(urm => urm.Role.Name == "Individual Vendor"))
            {
                userAttachmentsDto.QrImage = _qRCodeCreation.CreateQRCode("https://ohsjoeq.com/Vendor/" + user.Id);
            }
            userDto.AllAttachmentsUploaded = false;

            var allAttachments = await _context.SubscriptionTypeAttachmentMappings
                                                       .Where(s => s.SubscriptionTypeId == user.SubscriptionTypeId)
                                                       .Include(s => s.Attachment)
                                                       .ToListAsync();

            var userAttachmentUploaded = await _context.SubscriptionTypeAttachments
                                                        .Where(s => s.UserId == id)
                                                        .Include(s => s.SubscriptionTypeAttachmentMapping)
                                                        .ThenInclude(s => s.Attachment)
                                                        .ToListAsync();

            var userAttachmentUploadedIDs = userAttachmentUploaded
                                                .Select(s => s.SubscriptionTypeAttachmentMappingId)
                                                .ToList();


            var attachmentsUploadedDto = new List<AttachmentWithSubscriptionTypeIdDto>();

            if (userAttachmentUploaded.Count == 0)
            {
                userAttachmentsDto.User = userDto;
                userAttachmentsDto.AttachmentWithSubscriptionTypeId = allAttachments.Select(s => (
                    new AttachmentWithSubscriptionTypeIdDto
                    {
                        Attachment = _mapper.Map<Attachment, AttachmentDto>(s.Attachment),
                        SubscriptionTypeId = s.Id
                    })).ToList();
                return Ok(userAttachmentsDto);
            }

            var anotherAttachmentMustBeUploaded = allAttachments
                                            .Where(s => !userAttachmentUploadedIDs.Contains(s.Id))
                                            .Select(s => new AttachmentWithSubscriptionTypeIdDto { Attachment = _mapper.Map<Attachment, AttachmentDto>(s.Attachment), SubscriptionTypeId = s.Id })
                                            .ToList();

            anotherAttachmentMustBeUploaded.ForEach(s =>
            {
                var attachmentDto = (s.Attachment);
                attachmentsUploadedDto.Add(
                    new AttachmentWithSubscriptionTypeIdDto
                    {
                        Attachment = attachmentDto,
                        SubscriptionTypeId = s.SubscriptionTypeId
                    });
            });

            userAttachmentUploaded.ForEach(s =>
            {

                if (s.ImageUrl == null)
                {
                    var attachmentDto = _mapper.Map<Attachment, AttachmentDto>(s.SubscriptionTypeAttachmentMapping.Attachment);
                    attachmentsUploadedDto.Add(
                   new AttachmentWithSubscriptionTypeIdDto
                   {
                       Attachment = attachmentDto,
                       SubscriptionTypeId = s.SubscriptionTypeAttachmentMappingId
                   });
                }

            });

            if (attachmentsUploadedDto.Count > 0)
            {
                userAttachmentsDto.User = userDto;
                userAttachmentsDto.AttachmentWithSubscriptionTypeId = attachmentsUploadedDto;
                return Ok(userAttachmentsDto);
            }

            userDto.AllAttachmentsUploaded = true;
            userDto.IsVerified = user.IsActive;
            userAttachmentsDto.User = userDto;
            userAttachmentsDto.AttachmentWithSubscriptionTypeId = attachmentsUploadedDto;

            return Ok(userAttachmentsDto);

        }
        [HttpPost("UpdateUser")]

        public async Task<ActionResult<bool>> UpdateUser(string id, AppUserDto userAdminDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var userInDb = await _context.Users.SingleOrDefaultAsync(s => s.Id == id
                                                                        && s.IsDeleted == false);

            if (userInDb == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(userInDb);
            await _userManager.RemoveFromRolesAsync(userInDb, roles.ToArray());
            foreach (var role in userAdminDto.UserRoles)
            {
                var roleResult = await _userManager.AddToRoleAsync(userInDb, role.Name);
                if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);
            }


            RemoveDepartementFromUser(id);
            foreach (var departement in userAdminDto.UserDepartments)
            {
                await AddDepartementToUserByDepartementId(departement.Id, id);
            }


            _mapper.Map(userAdminDto, userInDb);

            return await _context.SaveChangesAsync() > 0;
        }

        [HttpPost("UpdateUserData")]

        public async Task<ActionResult<bool>> UpdateUserData(string id, AppUserDto userAdminDto)
        {
            // if (!ModelState.IsValid) return BadRequest();

            var userInDb = await _context.Users.SingleOrDefaultAsync(s => s.Id == id
                                                                        && s.IsDeleted == false);
            //      userInDb.Email = userAdminDto.Email;
            userInDb.FullName = userAdminDto.FullName;
            userInDb.PhoneNumber = userAdminDto.PhoneNumber;

            //_mapper.Map(userAdminDto, userInDb);

            return await _context.SaveChangesAsync() > 0;
        }

        [HttpPost("CreateUser")]
        public async Task<ActionResult<AppUserDto>> CreateUser(AppUserDto userAdminDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var user = _mapper.Map<AppUserDto, AppUser>(userAdminDto);

            if (await GetExistUser(user.Email)) return BadRequest("This email exist before.");


            // user.UserDepartments = null;
            // user.UserRoles = null;

            var userCreated = await _userManager.CreateAsync(user, userAdminDto.Password);

            if (!userCreated.Succeeded) return BadRequest(userCreated.Errors);

            if (userAdminDto.UserRoles != null && userAdminDto.UserRoles.Count() > 0)
            {

                foreach (var role in userAdminDto.UserRoles)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, role.Name);
                    if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);
                }
            }
            if (userAdminDto.UserDepartments != null && userAdminDto.UserDepartments.Count() > 0)
            {

                foreach (var departement in userAdminDto.UserDepartments)
                {
                    await AddDepartementToUserByDepartementId(departement.Id, user.Id);
                    // var roleResult =  AddDepartementToUser(departement.Depart);
                    // if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);
                }
            }

            //await _mailer.SendEmailAsync(userAdminDto.Email, "Your Password", userAdminDto.Password);
            var x = await _context.Users
                        .Include(s => s.UserDepartments)
                        .ThenInclude(s => s.Departement)
                        .SingleOrDefaultAsync(s => s.Id == user.Id);

            var result = _mapper.Map<AppUser, AppUserDto>(x);
            return Ok(result);

        }
        [HttpPost("DeleteUser")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var userInDb = await _context.Users.SingleOrDefaultAsync(x => x.Id == id
                                                                    && x.IsDeleted == false);

            if (userInDb == null) return NotFound();

            userInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("DeleteUsers")]
        public async Task<ActionResult> DeleteUser(List<string> ids)
        {
            foreach (var id in ids)
            {
                var userInDb = await _context.Users.SingleOrDefaultAsync(x => x.Id == id
                                                                   && x.IsDeleted == false);

                if (userInDb == null) return NotFound();

                userInDb.IsDeleted = true;
            }

            return Ok(await _context.SaveChangesAsync() > 0);
        }
        // [HttpDelete]
        // public async Task<ActionResult> DeleteAllUsers(AppUserDto userAdminDto)
        // {
        //     var userInDb = _context.Users
        //                         .Where(x => x.Id == userAdminDto.Id)
        //                         .ToList();

        //     if (userInDb.Count() == 0) return NotFound();

        //     // userInDb.IsDeleted = true;
        //     return Ok(await _context.SaveChangesAsync() > 0);
        // }
        private async Task<bool> GetExistUser(string email)
        {
            return await _context.Users.AnyAsync(s => s.Email == email);
        }

        private void RemoveDepartementFromUser(string userId)
        {
            var userDepartmenents = _context.UserDepartments
                                            .Where(s => s.UserId == userId)
                                            .ToList();

            foreach (var userDepartment in userDepartmenents)
            {
                _context.UserDepartments.Remove(userDepartment);
            }
            // await _context.SaveChangesAsync();
        }

        [HttpGet("GetAllUserInCompany")]
        public async Task<ActionResult> GetAllUserInCompany(int CompanyId)
        {
            var currentUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var AllUserInCompany = await _context.AppUsers.Where(x => x.IsDeleted == false && x.CompanyId == CompanyId && x.Id != currentUser)
                                                 .Include(s => s.UserDepartments)
                                                 .ThenInclude(x => x.Departement)
                                                 .Include(s => s.UserRoles)
                                                 .ThenInclude(a => a.Role)
                                                 .ToListAsync();

            var finalResult = AllUserInCompany.Where(s => s.UserRoles.FirstOrDefault().Role.Name != RoleName.CompanyAdmin).Select(x => new
            {
                DisplayName = GetRoleARName(x.UserRoles.FirstOrDefault().Role.Name) + " - " + x.UserDepartments.FirstOrDefault().Departement.Name + " - " + x.FullName,
                User = _mapper.Map<AppUser,
                    AppUserDto>(x)
            }).ToList();

            finalResult.ForEach(x =>
            {
                x.User.DisplayName = x.DisplayName;
            });
            return Ok(finalResult.Select(x => x.User).ToList());
        }
        [HttpGet("GetAllManagersInCompany")]
        public async Task<ActionResult> GetAllManagersInCompany(int CompanyId)
        {
            var alllManagersInCompany = await _context.AppUsers
                                                 .Where(x => x.IsDeleted == false &&
                                                        x.CompanyId == CompanyId &&
                                                        x.UserRoles.Any(urm => urm.Role.Name == "Company Supervisor" ||
                                                                        urm.Role.Name == "Company Departement Manager"))
                                                 .Include(s => s.UserDepartments)
                                                 .ThenInclude(s => s.Departement)
                                                 .Include(s => s.UserRoles)
                                                 .ThenInclude(a => a.Role)
                                                 .ToListAsync();

            return Ok(alllManagersInCompany.Select(_mapper.Map<AppUser, AppUserDto>));
        }
        [HttpPost("UserPhoto")]
        public async Task<ActionResult> UserPhoto(UploadFileDto uploadFileDto)
        {
            var userImage = _imageConversion.SaveImageToPath(uploadFileDto.ImageBase, ImagesPath.Clients, uploadFileDto.ImageName);
            var user = await _context.Users.Where(x => x.Id == uploadFileDto.UserId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound("User Not Found");

            user.UserPhoto = userImage;
            await _context.SaveChangesAsync();
            return Ok("https://ohsjoeq.com/Images/Clients/" + user.UserPhoto);

        }
        [HttpGet("GetAllSupervisrosInCompany")]
        public async Task<ActionResult> GetAllSupervisrosInCompany(int CompanyId)
        {
            var alllManagersInCompany = await _context.AppUsers
                                                 .Where(x => x.IsDeleted == false &&
                                                        x.CompanyId == CompanyId &&
                                                        x.UserRoles.Any(urm => urm.Role.Name == "Company Supervisor"))
                                                 .Include(x => x.UserDepartments)
                                                 .ThenInclude(x => x.Departement)
                                                 .Include(s => s.UserRoles)
                                                 .ThenInclude(a => a.Role)
                                                 .ToListAsync();
            var res = alllManagersInCompany.Select(x => new { User = _mapper.Map<AppUser, AppUserDto>(x), DisplayName = GetRoleARName(x.UserRoles.FirstOrDefault().Role.Name) + " - " + x.UserDepartments.FirstOrDefault().Departement.Name + " - " + x.FullName }).ToList();
            res.ForEach(x =>
            {
                x.User.DisplayName = x.DisplayName;
            });
            var final = res.Select(x => x.User).ToList();
            return Ok(final);
        }


        [HttpGet("ActivateUser")]
        public async Task<ActionResult> ActivateUser(string userId, bool isVerified)
        {
            var userInDb = await _context.AppUsers
                                .Include(x => x.UserDepartments)
                                .ThenInclude(x => x.Departement)
                                .Include(s => s.UserRoles)
                                .ThenInclude(s => s.Role)
                                .SingleOrDefaultAsync(s => s.Id == userId);
            try
            {
                var isRiskDeptFoundInDb = await _context.Departements
                                            .SingleOrDefaultAsync(s => s.Name == "قسم تقييم المخاطر");

                if (userInDb.UserRoles.Any(s => s.Role.Name == "Company Departement Manager") && isRiskDeptFoundInDb == null)
                {
                    var DepartementDto = new DepartementDto()
                    {
                        Name = "قسم تقييم المخاطر",
                        ParentId = userInDb.UserDepartments.FirstOrDefault().DepartementId,
                        UnitType = "DEPT",
                        CompanyId = userInDb.CompanyId,
                    };

                    var departement = _mapper.Map<DepartementDto, Departement>(DepartementDto);

                    departement.UnitType = DepartementUnitType.Depts;
                    await _context.Departements.AddAsync(departement);
                    await _context.SaveChangesAsync();
                }

            }
            catch (Exception ex)
            {

            }

            if (userInDb == null) return NotFound("User Not Found");

            userInDb.IsActive = isVerified;
            //send email
            try
            {
                await _mailer.SendEmailSendGridAsync(smtSettings.Value.TemplateIdActivaUser, new ActivateUserTemplate()
                {
                    UserFullName = userInDb.FullName,
                    DeptName = userInDb.UserDepartments.FirstOrDefault().Departement.Name,
                    LoginURL = "https://ohsjoeq.com/auth/login"
                }, userInDb.Email);
            }
            catch (Exception)
            {
            }
            return Ok(await _context.SaveChangesAsync() > 0);
        }



        public void Dispose()
        {
            _context.Dispose();
        }
    }
}