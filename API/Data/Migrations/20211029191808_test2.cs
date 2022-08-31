using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class test2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartementId",
                table: "Forms",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Forms_DepartementId",
                table: "Forms",
                column: "DepartementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_Departements_DepartementId",
                table: "Forms",
                column: "DepartementId",
                principalTable: "Departements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Forms_Departements_DepartementId",
                table: "Forms");

            migrationBuilder.DropIndex(
                name: "IX_Forms_DepartementId",
                table: "Forms");

            migrationBuilder.DropColumn(
                name: "DepartementId",
                table: "Forms");
        }
    }
}
