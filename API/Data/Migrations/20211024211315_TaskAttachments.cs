using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class TaskAttachments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TasksAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaskId = table.Column<int>(type: "int", nullable: true),
                    TasksId = table.Column<int>(type: "int", nullable: true),
                    SubscriptionTypeAttachmentId = table.Column<int>(type: "int", nullable: true),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TasksAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TasksAttachments_SubscriptionTypeAttachments_SubscriptionTypeAttachmentId",
                        column: x => x.SubscriptionTypeAttachmentId,
                        principalTable: "SubscriptionTypeAttachments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TasksAttachments_Tasks_TasksId",
                        column: x => x.TasksId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TasksAttachments_SubscriptionTypeAttachmentId",
                table: "TasksAttachments",
                column: "SubscriptionTypeAttachmentId");

            migrationBuilder.CreateIndex(
                name: "IX_TasksAttachments_TasksId",
                table: "TasksAttachments",
                column: "TasksId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TasksAttachments");
        }
    }
}
