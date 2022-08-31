using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateCompaniesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET IDENTITY_INSERT [Companies] ON INSERT [Companies] ([Id], [Name], [IsDeleted], [Logo], [EmployeesNumbers], [Website], [MapUrl], [City]) VALUES (1, N'OHS Company', 0, NULL, 100, NULL, NULL, NULL) SET IDENTITY_INSERT [Companies] OFF ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
