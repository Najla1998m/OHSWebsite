using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Helpers;
using API.Interfaces;
using API.Managers;
using API.Services;
using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly ITasksManager tasksManger;
        private readonly RoleManager<AppRole> _roleManager;

        // private readonly IEmailSender _emailSender;
        private readonly IMailer _mailer;

        public AccountController(UserManager<AppUser> userManager,
                                RoleManager<AppRole> roleManager,
                                SignInManager<AppUser> signInManager,
                                ITokenService tokenService,
                                IMapper mapper,
                                IMailer mailer,
                                ITasksManager _tasksManger,
                                DataContext context

            )
        {
            _roleManager = roleManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            tasksManger = _tasksManger;
            // _emailSender = emailSender;
            _mailer = mailer;
            _context = context;

        }

        //[HttpPost("register")]
        //public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        //{
        //    if (!ModelState.IsValid) return BadRequest();

        //    //check Email
        //    var res = await CheckUser(registerDto.Email);
        //    if (res) return Ok("username is already taken");


        //    // if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        //    // var user = new AppUser();

        //    // user.UserName = registerDto.Username;
        //    var user = _mapper.Map<RegisterDto, AppUser>(registerDto);

        //    var result = await _userManager.CreateAsync(user, registerDto.Password);

        //    if (!result.Succeeded) return BadRequest(result.Errors);

        //    try
        //    {
        //        await _mailer.SendEmailAsync(registerDto.Email, "Exceptionssword", registerDto.Password);

        //    }
        //    catch (Exception)
        //    {

        //    }

        //    // var message = new MimeMessage();
        //    // MailboxAddress from = new MailboxAddress("Admin",
        //    // "e.magdy@excp.sa");
        //    // message.From.Add(from);

        //    // MailboxAddress to = new MailboxAddress("Esam",
        //    // "dev.esam2014@gmail.com");
        //    // message.To.Add(to);

        //    // message.Subject = "Your Password Is " + registerDto.Password;
        //    // using (var client=new SmtpClient())
        //    // {
        //    //     await client.ConnectAsync("smtp.gmail.com", 587, true);
        //    //     await client.AuthenticateAsync("dev.esam2014@gmail.com","Dev.Esam*@#2651");
        //    //     await client.SendAsync(message);
        //    //     await client.DisconnectAsync(true);
        //    // }

        //    // await _emailSender.SendEmailAsync(user.Email,
        //    //                                     "Your Password",
        //    //                                     registerDto.Password);

        //    // var emailSender = new EmailSender(null)
        //    //                     .SendEmailAsync(user.Email,
        //    //                                     "Your Password",
        //    //                                     registerDto.Password);

        //    return new UserDto
        //    {
        //        Username = user.UserName,
        //        Email = user.Email,
        //        Token = await _tokenService.CreateToken(user),
        //        IsActive = user.IsActive
        //    };
        //}

        [HttpPost("RegisterDelegatedAdmin")]
        public async Task<ActionResult<UserDto>> RegisterDelegatedAdmin(RegisterDto registerDto)
        {

            var res = await CheckUser(registerDto.Email);
            if (res) return Ok("username is already taken");

           // var departement = await CreateDepartement(registerDto.CompanyId);
            var departement = _context.Departements.Where(x => x.Name == "الإدارة العليا" && x.CompanyId == registerDto.CompanyId).
                FirstOrDefault();

            if (departement == null) return BadRequest("Error in Created Departement");

            var delegatedAdmin = await CreateDelegatedAdminSendMail(registerDto, registerDto.SubscriptionTypeId);

            if (delegatedAdmin == null) return BadRequest("Error on created  Delegated Admin");

            //await CreateNotification(delegatedAdmin, "Delegated Admin ", 0, RoleName.CompanyDelegatedAdmin);
            await SetDepartementToCompanyCreated(delegatedAdmin.Id, departement.Id);
            dynamic RegisteredUser = new System.Dynamic.ExpandoObject();
            RegisteredUser.username = delegatedAdmin.UserName;
            RegisteredUser.id = delegatedAdmin.Id;
            RegisteredUser.email = delegatedAdmin.Email;
            RegisteredUser.IsActive = delegatedAdmin.IsActive;
            return Ok(RegisteredUser);

        }

        [HttpPost("RegisterAnonymousUser")]
        public async Task<ActionResult<UserDto>> RegisterAnonymousUser(RegisterAnonymousDto registerAnonymousDto)
        {

            var res = await CheckUser(registerAnonymousDto.Email);
            if (res) return Ok("username is already taken");


            var anonymousUser = await CreateAnonymousUserAndSendMail(registerAnonymousDto);

            if (anonymousUser == null) return BadRequest("Error on created  User");

            //  await CreateNotification(anonymousUser, " ", registerAnonymousDto.DepartementId, registerAnonymousDto.RoleName);
            var task = await tasksManger.AddCustomerCareTask(context: _context, anonymousUser.Id);
            dynamic RegisteredUser = new System.Dynamic.ExpandoObject();
            RegisteredUser.username = anonymousUser.UserName;
            RegisteredUser.id = anonymousUser.Id;
            RegisteredUser.email = anonymousUser.Email;
            RegisteredUser.IsActive = anonymousUser.IsActive;
            return Ok(RegisteredUser);

        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) // password Esam*123456
        {
            var user = await _userManager.Users
                                    .Where(x => x.Email == loginDto.Email).FirstOrDefaultAsync();

            if (user == null) return Unauthorized("من فضلك تاكد من البريد الالكترونى");

            // var result = await _signInManager
            //     .PasswordSignInAsync(loginDto.Email, loginDto.Password, loginDto.RememberMe, false);
            var result = await _signInManager
                          .CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("من فضلك تاكد من الرقم السرى");

            var code = await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);
            await _mailer.SendEmailAsync(loginDto.Email,
                        "كود التفعيل الخاص بك",
                        code,
                        user.FullName,
                        user.CompanyId);

            return Ok(new { Message = "تم تسجيل الدخول بنجاح ، تم إرسال كود التفعيل علي البريد الخاص بك ", code = code });
            // return new UserDto
            // {
            //     Username = user.UserName,
            //     Token = await _tokenService.CreateToken(user),
            //     Email = user.Email
            // };
        }
        [HttpPost("VerifySignInCode")]
        public async Task<ActionResult<UserDto>> VerifySignInCode(VerifyLoginCodeDto verifyLoginCodeDto) // password Esam*123456
        {
            var user = await _userManager.Users
                                    .Where(x => x.Email == verifyLoginCodeDto.Email)
                                    .Include(s => s.UserRoles)
                                    .ThenInclude(s => s.Role)
                                    .FirstOrDefaultAsync();

            if (user == null) return Unauthorized("Invalid username");

            var result = await _userManager
                .VerifyChangePhoneNumberTokenAsync(user, verifyLoginCodeDto.Code, user.PhoneNumber);

            if (!result) return Content("Invalid Code");


            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email,
                Roles = user.UserRoles.Select(s => _mapper.Map<AppUserRole, UserRolesDto>(s)).ToList()
            };

        }
        [HttpPost("ResendActivationCode")]
        public async Task<ActionResult<UserDto>> ResendActivationCode(LoginDto loginDto) // password Esam*123456
        {
            var user = await _userManager.Users
                                     .Where(x => x.Email == loginDto.Email).FirstOrDefaultAsync();

            if (user == null) return Unauthorized("Invalid username");


            var code = await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);
            await _mailer.SendEmailAsync(loginDto.Email,
                    "كود التفعيل الخاص بك",
                    code,
                    user.FullName,
                    user.CompanyId);

            return Ok();
        }

        [HttpPost("ResetPassword")]
        public async Task<ActionResult<UserDto>> ResetPassword(ResetPasswordDto resetPasswordDto) // password Esam*123456
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);

            if (user == null) return NotFound(new ResponseDto<string> { Message = "Email Not Found" });

            var code = await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);
            await _mailer.SendEmailAsync(resetPasswordDto.Email,
                            "كود التفعيل الخاص بك",
                            code,
                            user.FullName,
                            user.CompanyId);

            return Ok(new ResponseDto<string> { Data = code, Message = "تم إرسال كود التفعيل علي البريد الخاص بك " });
            // var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            // if (!result.Succeeded) return BadRequest(result.Errors);

            // return Ok("Your Password Changed Successfully");
        }
        [HttpPost("GetResetPasswordToken")]
        public async Task<ActionResult<UserDto>> GetResetPasswordToken(ResetPasswordConfirmation resetPasswordConfirmation) // password Esam*123456
        {
            var user = await _userManager.Users
                                   .Where(x => x.Email == resetPasswordConfirmation.Email)
                                   .Include(s => s.UserRoles)
                                   .ThenInclude(s => s.Role)
                                   .FirstOrDefaultAsync();

            if (user == null) return NotFound(new ResponseDto<string> { Message = "Email Not Found" });

            var result = await _userManager
                .VerifyChangePhoneNumberTokenAsync(user, resetPasswordConfirmation.Code, user.PhoneNumber);

            if (!result) return NotFound(new ResponseDto<string> { Message = "Invalid Code" });

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            return Ok(new ResponseDto<string> { Data = token });

        }
        [HttpPost("VerifyResetPassword")]
        public async Task<ActionResult<UserDto>> VerifyResetPassword(PostResetPasswordDto resetPasswordDto) // password Esam*123456
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);

            if (user == null) return NotFound(new ResponseDto<string> { Message = "Email Not Found" });

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new ResponseDto<string> { Message = "Your Password Changed Successfully" });
        }
        [HttpPost("AddUserToRoleByUserIdAndRoleId")]
        public async Task<ActionResult> AddUserToRoleByUserIdAndRoleId(string userId, string roleId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return NotFound();

            var role = await _roleManager.FindByIdAsync(roleId);

            if (role == null) return NotFound();

            var roleResult = await _userManager.AddToRoleAsync(user, role.Name);

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return Ok();
        }
        [HttpPost("AddUserToRoleByUserAndRoleName")]
        public async Task<ActionResult> AddUserToRoleByUserAndRoleName(AppUser user, string roleName)
        {


            var roleResult = await _userManager.AddToRoleAsync(user, roleName);

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return Ok();
        }

        [HttpPost("RegsiterCompany")]
        public async Task<ActionResult> RegsiterCompany(VendorRegisterDto companyDto) // password Esam*123456
        {

            //check if Account is exisit
            //check Email
            var res = await CheckUser(companyDto.CompanyDto.Email);
            if (res)
                return Ok("username is already taken");
            //Get Free Or Default Package 
            var package = await _context.Packages.Where(x => x.Id == 1).FirstOrDefaultAsync();
            ////Check Employee Number
            //if (package.EmployeesNumbers < companyDto.CompanyDto.EmployeesNumbers)
            //{
            //    return BadRequest("The number of employees is more than the number available");
            //}
            // create company and saved in created user
            var company = await CreateCompany(companyDto.CompanyDto);

            if (company == null) return BadRequest("Error in Created Company");


            companyDto.CompanyDto.Id = company.Id;

            var departement = await CreateDepartement(company.Id);

            if (departement == null) return BadRequest("Error in Created Departement");


            var createCompany = await CreateCompanyAdminAndSetRoleAndSendMail(companyDto.CompanyDto, companyDto.SubscriptionTypeId, package);

            if (createCompany == null) return BadRequest("Error on created Vendor");


            //  await CreateNotification(createCompany, "Company ", 0, RoleName.CompanyAdmin);
            await _context.SaveChangesAsync();


            await SetDepartementToCompanyCreated(createCompany.Id, departement.Id);

            dynamic RegisteredUser = new System.Dynamic.ExpandoObject();
            RegisteredUser.username = createCompany.UserName;
            RegisteredUser.id = createCompany.Id;
            RegisteredUser.email = createCompany.Email;
            RegisteredUser.IsActive = createCompany.IsActive;
            return Ok(RegisteredUser);

        }

        private async Task SetDepartementToCompanyCreated(string companyId, int departementId)
        {
            var userDepartments = new UserDepartments
            {
                UserId = companyId,
                DepartementId = departementId
            };
            await _context.UserDepartments.AddAsync(userDepartments);
            await _context.SaveChangesAsync();
        }

        private async Task<Departement> CreateDepartement(int companyId)
        {
            var departement = new Departement
            {
                CompanyId = companyId,
                Name = "الإدارة العليا"
            };
            await _context.Departements.AddAsync(departement);

            return await _context.SaveChangesAsync() > 0 ? departement : null;
        }

        [HttpPost("RegsiterCompanyVendor")]
        public async Task<ActionResult> RegsiterCompanyVendor(VendorRegisterDto companyVendorRegisterDto) // password Esam*123456
        {
            //check Email
            var res = await CheckUser(companyVendorRegisterDto.CompanyDto.Email);
            if (res)
                return Ok("username is already taken");
            // create company and saved in created user
            var company = await CreateCompany(companyVendorRegisterDto.CompanyDto);

            if (company == null) return BadRequest("Error in Created Company");


            companyVendorRegisterDto.CompanyDto.Id = company.Id;

            var vendor = await CreateVendorAndSetRoleAndSendMail(companyVendorRegisterDto.CompanyDto, companyVendorRegisterDto.SubscriptionTypeId,false);

            if (vendor == null) return BadRequest("Error on created Vendor");


            //companyVendorRegisterDto.SubscriptionTypeAttachmentDtos.ForEach(sa =>
            //{
            //    sa.UserId = vendor.Id;
            //    CreateSubscriptionTypeAttachment(sa);
            //});

            // await CreateNotification(vendor, " Company vendor", 0, RoleName.CompanyVendor);
            await _context.SaveChangesAsync();

            dynamic RegisteredUser = new System.Dynamic.ExpandoObject();
            RegisteredUser.username = vendor.UserName;
            RegisteredUser.id = vendor.Id;
            RegisteredUser.email = vendor.Email;
            RegisteredUser.IsActive = vendor.IsActive;
            return Ok(RegisteredUser);

        }


        [HttpPost("SetUserAsTeamManger")]
        public async Task<ActionResult> SetUserAsTeamManger(string userId, bool isManager) // password Esam*123456
        {
            var user = _context.AppUsers.Where(x => x.Id == userId).FirstOrDefault();
            if (user == null)
                return BadRequest();

            user.IsTeamManager = isManager;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("RegsiterIndividualVendor")]
        public async Task<ActionResult> RegsiterIndividualVendor(VendorRegisterDto individualVendorRegisterDto) // password Esam*123456
        {
            if (!ModelState.IsValid) return BadRequest();

            if (await UserExistsByEmail(individualVendorRegisterDto.CompanyDto.Email)) return BadRequest("Company already exist");

            // create company and saved in created user
            var res = await CheckUser(individualVendorRegisterDto.CompanyDto.Email);
            if (res)
                return Ok("username is already taken");
            // var company = _mapper.Map<CompanyDto, Company>(individualVendorRegisterDto.CompanyDto);

            // await _context.Companies.AddAsync(company);
            // await _context.SaveChangesAsync();

            // var company = CreateCompany(individualVendorRegisterDto.CompanyDto);
            var companyId = await GetOHSCompanyId();

            if (companyId == 0) return BadRequest("Not Found OHS Company");

            // var user = new AppUser()
            // {
            //     UserName = individualVendorRegisterDto.CompanyDto.Name,
            //     Email = individualVendorRegisterDto.CompanyDto.Email,
            //     PhoneNumber = individualVendorRegisterDto.CompanyDto.PhoneNumber,
            //     CompanyId = company.Id,
            // };

            // var randomPassword = GenerateRandomPassword.Generate(10, 2);

            // var result = await _userManager.CreateAsync(user, randomPassword);
            // if (!result.Succeeded) return BadRequest(result.Errors);
            individualVendorRegisterDto.CompanyDto.Id = companyId;

            var vendor = await CreateVendorAndSetRoleAndSendMail(individualVendorRegisterDto.CompanyDto, individualVendorRegisterDto.SubscriptionTypeId,true);

            if (vendor == null) return BadRequest("Error on created Vendor");

            //individualVendorRegisterDto.SubscriptionTypeAttachmentDtos.ForEach(sa =>
            //{
            //    sa.UserId = vendor.Id;
            //    CreateSubscriptionTypeAttachment(sa);
            //});

            //Add skills
            individualVendorRegisterDto.SkillIdList.ForEach(skillId =>
            {
                var skillDto = new VendorSkillDto()
                {
                    UserId = vendor.Id,
                    SkillId = skillId
                };
                AddSkill(skillDto);
            });
            //  await CreateNotification(vendor, "individual Vendor", 0, RoleName.IndividualVendor);
            // foreach (var SubscriptionTypeAttachmentDto in individualVendorRegisterDto.SubscriptionTypeAttachmentDtos)
            // {
            //     var subscriptionTypeAttachment = _mapper.Map<SubscriptionTypeAttachmentDto, SubscriptionTypeAttachment>(SubscriptionTypeAttachmentDto);
            //     subscriptionTypeAttachment.UserId = user.Id;
            //     await _context.SubscriptionTypeAttachments.AddAsync(subscriptionTypeAttachment);
            // }

            // var notificationCreatedDate = DateTime.Now;
            // var notification = new Notification
            // {
            //     Date = notificationCreatedDate,
            //     Body = "Company Vendor Created At " + notificationCreatedDate,
            //     NotificationTypeId = (int)NotificationTypes.CompanyVendorSubscription,
            //     Title = "Company Vendor " + user.UserName + " Created",
            //     UserId = user.Id,
            //     TasksId = 4   // Don't Forget to change it
            // };

            // await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            dynamic RegisteredUser = new System.Dynamic.ExpandoObject();
            RegisteredUser.username = vendor.UserName;
            RegisteredUser.id = vendor.Id;
            RegisteredUser.email = vendor.Email;
            RegisteredUser.IsActive = vendor.IsActive;
            return Ok(RegisteredUser);

        }

        private async Task<bool> UserExistsByUserName(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
        private async Task<bool> UserExistsByEmail(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
        private async Task<bool> UserExistsByUserNameOrEmail(string username, string email)
        {
            return await _userManager.Users
                            .AnyAsync(x => x.UserName.ToLower() == username.ToLower()
                                        || x.Email.ToLower() == email.ToLower());
        }
        private async Task<int> GetOHSCompanyId()
        {
            var ohsCompany = await _context.Companies.SingleOrDefaultAsync(s => s.Id == 1);

            if (ohsCompany != null) return ohsCompany.Id;

            return 0;

        }
        private async Task<AppUser> CreateVendorAndSetRoleAndSendMail(CompanyDto companyDto, int? SubscriptionTypeId, bool IsIndiv)
        {
            var user = new AppUser()
            {

                FullName = companyDto.Name,
                UserName = companyDto.Email,
                Email = companyDto.Email,
                PhoneNumber = companyDto.PhoneNumber,
                CompanyId = companyDto.Id,
                SubscriptionTypeId = SubscriptionTypeId

            };

            // var randomPassword = GenerateRandomPassword.Generate(10, 2);
            var randomPassword = GenerateRandomPassword.CreatePassword(10);

            var result = await _userManager.CreateAsync(user, randomPassword);

            if (!result.Succeeded) return null;
            if (IsIndiv)
            {

                await AddUserToRoleByUserAndRoleName(user, RoleName.IndividualVendor);
            }
            else
            {

                await AddUserToRoleByUserAndRoleName(user, RoleName.CompanyVendor);

            }
            var emailMessage = "لقد تمت إضافة حسابك الجديد بنجاح في الموقع وتحديد كلمة سر إفتراضية لك , من فضلك قم بتسجيل الدخول من خلال الرابط المرفق بإستخدام بريدك الإلكتروني وكلمة السر الخاصة بك ";
            //return with live
            try
            {
                await _mailer.SendEmailAsync(user.Email,
                        emailMessage + Environment.NewLine,
                        randomPassword,
                        user.FullName,
                        user.CompanyId);

            }
            catch (Exception)
            {
            }

            return user;

        }
        private async Task<AppUser> CreateCompanyAdminAndSetRoleAndSendMail(CompanyDto companyDto, int? SubscriptionTypeId, Package package)
        {


            var user = new AppUser()
            {
                FullName = companyDto.Name,
                UserName = companyDto.Email,
                Email = companyDto.Email,
                PhoneNumber = companyDto.PhoneNumber,
                CompanyId = companyDto.Id,
                PackageId = package.Id,
                Duration = package.Duration,
                PackageAllowedDays = package.AllowedDays,
                EmployeesNumbers = package.EmployeesNumbers,
                SubscriptionTypeId = SubscriptionTypeId,
                IsActive = companyDto.Id == 1 ? true : false
            };

            // var randomPassword = GenerateRandomPassword.Generate(10, 2);
            var randomPassword = GenerateRandomPassword.CreatePassword(10);

            var result = await _userManager.CreateAsync(user, randomPassword);

            if (!result.Succeeded) return null;

            await AddUserToRoleByUserAndRoleName(user, RoleName.CompanyAdmin);
            var emailMessage = "لقد تمت إضافة حسابك الجديد بنجاح في الموقع وتحديد كلمة سر إفتراضية لك , من فضلك قم بتسجيل الدخول من خلال الرابط المرفق بإستخدام بريدك الإلكتروني وكلمة السر الخاصة بك ";
            //return with live
            try
            {
                await _mailer.SendEmailAsync(companyDto.Email,
                        emailMessage + Environment.NewLine,
                        randomPassword,
                        companyDto.Name,
                        user.CompanyId);

            }
            catch (Exception ex)
            {

            }

            return user;

        }
        private async Task<AppUser> CreateDelegatedAdminSendMail(RegisterDto registerDto, int? SubscriptionTypeId)
        {
            var user = new AppUser()
            {
                FullName = registerDto.FullName,
                UserName = registerDto.Email,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                CompanyId = registerDto.CompanyId,
                SubscriptionTypeId = SubscriptionTypeId,
                IsActive = true
            };

            // var randomPassword = GenerateRandomPassword.Generate(10, 2);
            var randomPassword = GenerateRandomPassword.CreatePassword(10);

            var result = await _userManager.CreateAsync(user, randomPassword);

            if (!result.Succeeded) return null;

            await AddUserToRoleByUserAndRoleName(user, RoleName.CompanyDelegatedAdmin);

            var emailMessage = "لقد تمت إضافة حسابك الجديد بنجاح في الموقع وتحديد كلمة سر إفتراضية لك , من فضلك قم بتسجيل الدخول من خلال الرابط المرفق بإستخدام بريدك الإلكتروني وكلمة السر الخاصة بك ";
            //return with live
            try
            {
                await _mailer.SendEmailAsync(user.Email,
                emailMessage + Environment.NewLine,
                randomPassword, registerDto.FullName,
                user.CompanyId);

            }
            catch (Exception) { }
            return user;
        }
        private async Task<AppUser> CreateAnonymousUserAndSendMail(RegisterAnonymousDto registerAnonymousDto)
        {


            if (registerAnonymousDto.RoleName == RoleName.CompanyDepartementManager || registerAnonymousDto.RoleName == RoleName.CompanySupervisor)
            {
                registerAnonymousDto.SubscriptionTypeId = 17;
            }

            var user = new AppUser()
            {
                FullName = registerAnonymousDto.FullName,
                UserName = registerAnonymousDto.Email,
                Email = registerAnonymousDto.Email,
                PhoneNumber = registerAnonymousDto.PhoneNumber,
                CompanyId = registerAnonymousDto.CompanyId,
                SubscriptionTypeId = registerAnonymousDto.SubscriptionTypeId,
                IsActive = registerAnonymousDto.CompanyId == 1 ? true : false
            };

            // var randomPassword = GenerateRandomPassword.Generate(10, 2);
            var randomPassword = GenerateRandomPassword.CreatePassword(10);

            var result = await _userManager.CreateAsync(user, randomPassword);

            if (!result.Succeeded) return null;


            await AddUserToRoleByUserAndRoleName(user, registerAnonymousDto.RoleName);
            await _context.UserDepartments.AddAsync(
                new UserDepartments()
                {
                    DepartementId = registerAnonymousDto.DepartementId,
                    UserId = user.Id
                });
            await _context.SaveChangesAsync();


            var emailMessage = "لقد تمت إضافة حسابك الجديد بنجاح في الموقع وتحديد كلمة سر إفتراضية لك , من فضلك قم بتسجيل الدخول من خلال الرابط المرفق بإستخدام بريدك الإلكتروني وكلمة السر الخاصة بك ";
            //return with live
            try
            {
                await _mailer.SendEmailAsync(user.Email,
                        emailMessage + Environment.NewLine,
                        randomPassword,
                        registerAnonymousDto.FullName,
                        user.CompanyId);

            }
            catch (Exception) { }
            return user;
        }
        private async Task<Company> CreateCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<CompanyDto, Company>(companyDto);

            await _context.Companies.AddAsync(company);

            return await _context.SaveChangesAsync() > 0 ? company : null;
        }
        private async void CreateSubscriptionTypeAttachment(SubscriptionTypeAttachmentDto subscriptionTypeAttachmentDto)
        {
            await _context.SubscriptionTypeAttachments
                    .AddAsync(_mapper.Map<SubscriptionTypeAttachmentDto, SubscriptionTypeAttachment>(subscriptionTypeAttachmentDto));
        }
        private async void AddSkill(VendorSkillDto vendorSkillDto)
        {
            await _context.VendorSkills
                    .AddAsync(_mapper.Map<VendorSkillDto, VendorSkill>(vendorSkillDto));
        }
        private async Task CreateNotification(AppUser user, string DisplayString, int DepartementId, string rollName)
        {

            //Tasks tasks = await tasksManger.AddCustomerCareTask(context: _context, user, DepartementId, rollName);


            //var notificationCreatedDate = DateTime.Now;
            //var notification = new Notification
            //{
            //    Date = notificationCreatedDate,
            //    Body = tasks.Description + " Created At " + notificationCreatedDate,
            //    NotificationTypeId = (int)NotificationTypes.CompanyVendorSubscription,
            //    Title = tasks.Description + " " + user.UserName + " Created",
            //    UserId = tasks.AssignedTo.Id,
            //    TasksId = tasks.Id
            //};

            //await _context.Notifications.AddAsync(notification);
            //await _context.SaveChangesAsync();
        }


        private async Task<bool> CheckUser(string Email)
        {
            var user = await _context.Users.Where(x => x.UserName == Email).ToListAsync();
            return user.Count() > 0;
        }
    }
}