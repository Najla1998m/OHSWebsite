using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulatePackageTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET IDENTITY_INSERT  [Packages] on INSERT INTO [Packages] ([id], [Name]  ,[Symbol] ,[IsVisible]   ,[IsDeleted],[ForVendors]  ,[ForClients]  ,[EmployeesNumbers] ,[Duration]  ,[AllowedDays] ,[PricePerEmployee]) VALUES  (1,'Free Package','Free',1,0 ,0 ,1 ,10,30,7 ,0) SET IDENTITY_INSERT [Packages] OFF ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
