using API.Entities;
using API.Entities.Forms;
using API.Entities.Polls;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext
     : IdentityDbContext<AppUser, AppRole, string, IdentityUserClaim<string>,
    AppUserRole, IdentityUserLogin<string>,
    IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<AppUser>()
                          .HasMany(ur => ur.UserRoles)
                          .WithOne(u => u.User)
                          .HasForeignKey(ur => ur.UserId)
                          .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();


            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserDepartments)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<Departement>()
                .HasMany(ur => ur.UserDepartments)
                .WithOne(u => u.Departement)
                .HasForeignKey(ur => ur.DepartementId)
                .IsRequired();

            builder.Entity<UserDepartments>()
                    .HasKey(bc => new { bc.DepartementId, bc.UserId });


            // builder.Entity<UserDepartments>()
            //         .Property(us =>us.DepartementId)
            //         .HasColumnOrder(1);

            // builder.Entity<UserDepartments>()
            //         .HasOne(bc => bc.Departement)
            //         .WithMany(b => b.UserDepartments)
            //         .HasForeignKey(bc => bc.DepartementId);

            // builder.Entity<UserDepartments>()
            //         .HasOne(bc => bc.User)
            //         .WithMany(c => c.UserDepartments)
            //         .HasForeignKey(bc => bc.UserId);

            // builder.Entity<AppUser>()
            //     .HasMany(ur => ur.UserDepartments)
            //     .WithOne(u => u.User)
            //     .HasForeignKey(ur => ur.UserId)
            //     .IsRequired();

            // builder.Entity<Departement>()
            //     .HasMany(ur => ur.UserDepartments)
            //     .WithOne(u => u.Departement)
            //     .HasForeignKey(ur => ur.DepartementId)
            //     .IsRequired();


            // builder.Entity<AppUser>()
            //     .HasMany(ur => ur.UserRoles)
            //     .WithOne(u => u.User)
            //     .HasForeignKey(s => s.UserId)
            //     .IsRequired();

            // builder.Entity<AppRole>()
            //     .HasMany(ur => ur.UserRoles)
            //     .WithOne(u => u.Role)
            //     .HasForeignKey(ur => ur.RoleId)
            //     .IsRequired();

            //comment
            // builder.Entity<AppUserRole>(userRole =>
            //        {
            //            userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

            //            userRole.HasOne(ur => ur.Role)
            //                .WithMany(r => r.UserRoles)
            //                .HasForeignKey(ur => ur.RoleId)
            //                .IsRequired();

            //            userRole.HasOne(ur => ur.User)
            //                .WithMany(r => r.UserRoles)
            //                .HasForeignKey(ur => ur.UserId)
            //                .IsRequired();
            //        });

            // builder.Entity<AppUserRole>(userRole =>
            //        {
            //            userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

            //            userRole.HasOne(ur => ur.Role)
            //                .WithMany(r => r.UserRoles)
            //                .HasForeignKey(ur => ur.RoleId)
            //                .IsRequired();

            //            userRole.HasOne(ur => ur.User)
            //                .WithMany(r => r.UserRoles)
            //                .HasForeignKey(ur => ur.UserId)
            //                .IsRequired();
            //        });
            // builder.
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<StaticPage> StaticPages { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CancelSubscriptionReason> CancelSubscriptionReasons { get; set; }
        public DbSet<SliderImage> SliderImages { get; set; }
        public DbSet<ContactUsMsg> ContactUsMsgs { get; set; }
        public DbSet<NotificationType> NotificationTypes { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<SubscriptionType> SubscriptionTypes { get; set; }
        public DbSet<SubscriptionTypeAttachment> SubscriptionTypeAttachments { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<WizardType> WizardTypes { get; set; }
        public DbSet<Wizard> Wizards { get; set; }
        public DbSet<Order> Orders { get; set; }
        //public DbSet<OrderStatus> OrderStatues { get; set; }
        public DbSet<Departement> Departements { get; set; }
        public DbSet<QuestionsPage> QuestionsPages { get; set; }
        public DbSet<UserDepartments> UserDepartments { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<StockProducts> StockProducts { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<VendorSkill> VendorSkills { get; set; }
        public DbSet<PackageDetails> PackageDetails { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<TasksLevel> TasksLevels { get; set; }
        public DbSet<TasksStatus> TasksStatus { get; set; }
        public DbSet<VendorRating> VendorRatings { get; set; }
        public DbSet<SubscriptionTypeAttachmentMapping> SubscriptionTypeAttachmentMappings { get; set; }
        public DbSet<PackageCriteria> PackageCriterias { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<OfferStatus> OfferStatuses { get; set; }
        public DbSet<SubscriptionTypesTerm> SubscriptionTypesTerms { get; set; }
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<QuotationStatus> QuotationStatuses { get; set; }
        public DbSet<TasksAttachment> TasksAttachments { get; set; }
        public DbSet<DepartmentTypeRole> DepartmentTypeRoles { get; set; }



        #region Forms
        public DbSet<Form> Forms { get; set; }
        public DbSet<FormItem> FormItems { get; set; }
        public DbSet<FormItemType> FormItemTypes { get; set; }
        public DbSet<FormOptionSet> FormOptionSets { get; set; }
        public DbSet<FormOptionSetItem> FormOptionSetItems { get; set; }

        #endregion


        #region Poll
        public DbSet<Poll> Polls { get; set; }
        public DbSet<PollApproval> PollApprovals { get; set; }
        public DbSet<PollDetail> PollDetails { get; set; }
        public DbSet<PollItem> PollItems { get; set; }
        public DbSet<PollItemAction> PollItemActions { get; set; }
        #endregion
    }
}