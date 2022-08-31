using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateUsersTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT [AspNetUsers] ([Id], [JobTitle], [PackageId], [SubscriptionTypeId], [IsEmployeeExpired], [IsDateExpired], [ChargeDate], [Duration], [EmployeesNumbers], [PackageAllowedDays], [IsActive], [IsDeleted], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount], [CompanyId], [IsTeamManager]) VALUES (N'169943da-d718-4fb1-9040-838720b6b458', NULL, NULL, NULL, 0, 0, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), 0, 0, 0, 1, 0, N'EsamMagdy', N'ESAMMAGDY', N'dev.esam2014@gmail.com', N'DEV.ESAM2014@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEJPydJEkH/c7IjwCrAEMKnWkuFJJdyQAczaY3Kq6ICwy32OzUhJrwjPb8ox7R7K6Zw==', N'BJJUW366BPE46CXKLTC3XCX4W5YJQHYQ', N'36795c17-7cf4-455f-9381-c9133ab17f98', N'01283476432', 0, 0, NULL, 1, 0, 1, 0)");
            migrationBuilder.Sql("INSERT [AspNetUsers] ([Id], [JobTitle], [PackageId], [SubscriptionTypeId], [IsEmployeeExpired], [IsDateExpired], [ChargeDate], [Duration], [EmployeesNumbers], [PackageAllowedDays], [IsActive], [IsDeleted], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount], [CompanyId], [IsTeamManager]) VALUES (N'ca50bf21-a0eb-4503-84f8-37881f4cf6ca', NULL, NULL, NULL, 0, 0, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), 0, 0, 0, 0, 0, N'AhmedFadl', N'AHMEDFADL', N'ahmed.abo.alfadl@gmail.com', N'AHMED.ABO.ALFADL@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEMx1ul+f45J2FzQ86pygW7e9uiwJrTFV2HqmSx0rxqN2YokcIBaFchipAs3AdsloJA==', N'XUIYOOMXLLNC6YDNUZT3VS7CGAZRZZFR', N'3a886236-e712-41a0-915b-42c724cb613d', N'01092631343', 0, 0, NULL, 1, 0, 1, 0)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
