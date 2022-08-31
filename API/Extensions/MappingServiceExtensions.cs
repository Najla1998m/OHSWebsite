using System;
using System.Text;
using API.Data;
using API.Entities;
using API.Helpers;
using API.Helpers.Mapping;
using API.Helpers.Mapping.Forms;
using API.Helpers.Mapping.Polls;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class MappingServiceExtensions
    {
        public static IServiceCollection AddMappingServices(this IServiceCollection services, IConfiguration config)
        {
            var mappingConfig = new MapperConfiguration(mc =>
                               {
                                   mc.AddProfile(new AppRole_RoleDtoProfile());
                                   mc.AddProfile(new AppUser_AppUserDtoProfile());
                                   mc.AddProfile(new AppUser_CompanyVendoProfile());
                                   mc.AddProfile(new AppUser_RegisterDtoProfile());
                                   mc.AddProfile(new AppUserRole_UserRolesDtoProfile());
                                   mc.AddProfile(new Category_CategoryDtoProfile());
                                   mc.AddProfile(new Client_ClientDtoProfile());
                                   mc.AddProfile(new Company_CompanyDtoProfile());
                                   mc.AddProfile(new Departement_DepartementDtoProfile());
                                   mc.AddProfile(new Notification_NotificationDtoProfile());
                                   mc.AddProfile(new NotificationType_NotificationTypeDtoProfile());
                                   mc.AddProfile(new Package_PackageDtoProfile());
                                   mc.AddProfile(new QuestionsPage_QuestionsPageDtoProfile());
                                   mc.AddProfile(new Setting_SettingDtoProfile());
                                   mc.AddProfile(new Attachments_AttachmentsDtoProfile());
                                   mc.AddProfile(new SliderImage_SliderImageDtoProfile());
                                   mc.AddProfile(new StaticPage_StaticPageDtoProfile());
                                   mc.AddProfile(new SubscriptionTypeAttachment_SubscriptionTypeAttachmentDtoProfile());
                                   mc.AddProfile(new ContactUsMsg_ContactUsMsgDtoProfile());
                                   mc.AddProfile(new SubscriptionTypeDto_SubscriptionTypeDtoProfile());
                                   mc.AddProfile(new UserDepartmentsDto_UserDepartmentsProfile());
                                   mc.AddProfile(new VendorSkillDto_VendorSkillDtoProfile());
                                   mc.AddProfile(new SkillDto_SkillDtoProfile());
                                   mc.AddProfile(new CancelSubscriptionReason_CancelSubscriptionReasonDtoProfile());
                                   mc.AddProfile(new Product_ProductDtoProfile());
                                   mc.AddProfile(new Stock_StockDtoProfile());
                                   mc.AddProfile(new StockProducts_StockProductsDtoProfile());
                                   mc.AddProfile(new Skill_SkillDtoProfile());
                                   mc.AddProfile(new VendorSkill_VendorSkillDtoProfile());
                                   mc.AddProfile(new PackageDetails_PackageDetailsDtoProfile());
                                   mc.AddProfile(new Tasks_TasksDtoProfile());
                                   mc.AddProfile(new TasksLevel_TasksLevelDtoProfile());
                                   mc.AddProfile(new SubscriptionType_SubscriptionTypeDtoProfile());
                                   mc.AddProfile(new SubscriptionTypeAttachment_SubscriptionTypeAttachmentDtoProfile());
                                   mc.AddProfile(new VendorRating_VendorRatingDtoProfile());
                                   mc.AddProfile(new Company_CompanyDtoProfile());
                                   mc.AddProfile(new SubscriptionTypeAttachmentMapping_SubscriptionTypeAttachmentMappingDtoProfile());
                                   mc.AddProfile(new PackageCriteria_PackageCriteriaDtoProfile());
                                   mc.AddProfile(new Order_OrderDtoProfile());
                                   mc.AddProfile(new Offer_OfferDtoProfile());
                                   mc.AddProfile(new OfferStatus_OfferStatusDtoProfile());
                                   mc.AddProfile(new SubscriptionTypesTerms_SubscriptionTypesTermDto_Profile());
                                   mc.AddProfile(new Quotation_QuotationDtoProfile());
                                   mc.AddProfile(new TasksStatus_TasksStatusDtoProfile());
                                   mc.AddProfile(new AddDepartmentToUserDto_UserDepartmentProfile());
                                   mc.AddProfile(new DepartmentTypeRoleDTO_DepartmentTypeRole_profile());
                                   mc.AddProfile(new TasksAttachmentDTO_TasksAttachment());

                                   #region Forms
                                   mc.AddProfile(new FormsProfilesFormDTO());
                                   mc.AddProfile(new FormsItemProfilesFormItemDTO());
                                   mc.AddProfile(new FormsItemTypeProfilesFormItemTypeDTO());
                                   mc.AddProfile(new FormsOptinSetProfilesFormoptinSetDTO());
                                   mc.AddProfile(new FormsOptinSetItemProfilesFormoptinSetItemDTO());

                                   #endregion

                                   #region Poll
                                   mc.AddProfile(new PollProfile());
                                   mc.AddProfile(new PollItemProfile());
                                   mc.AddProfile(new PollActionProfile());
                                   mc.AddProfile(new PollDetailsProfile());
                                   mc.AddProfile(new PollItemAprovalProfile());

                                   #endregion
                                   // mc.AddProfile(new )
                               });

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
            return services;
        }
    }
}