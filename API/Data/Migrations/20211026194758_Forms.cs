using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class Forms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FormItemTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefaultValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormItemTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormOptionSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayNameAr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayNameEn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefaultValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormOptionSets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Forms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayNameAr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayNameEn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormOptionSetItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValueAR = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValueEN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormOptionSetId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormOptionSetItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormOptionSetItems_FormOptionSets_FormOptionSetId",
                        column: x => x.FormOptionSetId,
                        principalTable: "FormOptionSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FormItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayNameAr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayNameEn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefaultValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormOptionSetId = table.Column<int>(type: "int", nullable: true),
                    FormItemTypeId = table.Column<int>(type: "int", nullable: true),
                    FormId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormItems_FormItemTypes_FormItemTypeId",
                        column: x => x.FormItemTypeId,
                        principalTable: "FormItemTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FormItems_FormOptionSets_FormOptionSetId",
                        column: x => x.FormOptionSetId,
                        principalTable: "FormOptionSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FormItems_Forms_FormId",
                        column: x => x.FormId,
                        principalTable: "Forms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormItems_FormId",
                table: "FormItems",
                column: "FormId");

            migrationBuilder.CreateIndex(
                name: "IX_FormItems_FormItemTypeId",
                table: "FormItems",
                column: "FormItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_FormItems_FormOptionSetId",
                table: "FormItems",
                column: "FormOptionSetId");

            migrationBuilder.CreateIndex(
                name: "IX_FormOptionSetItems_FormOptionSetId",
                table: "FormOptionSetItems",
                column: "FormOptionSetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormItems");

            migrationBuilder.DropTable(
                name: "FormOptionSetItems");

            migrationBuilder.DropTable(
                name: "FormItemTypes");

            migrationBuilder.DropTable(
                name: "Forms");

            migrationBuilder.DropTable(
                name: "FormOptionSets");
        }
    }
}
