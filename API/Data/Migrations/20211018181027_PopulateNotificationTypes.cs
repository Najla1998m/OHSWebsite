using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateNotificationTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('New Manager Subscription', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('Subscription Attachment Upload', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('Account Expiry', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('Account Renewal Request', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('OHS Support', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('Contact Support Message', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('Company Vendor Subscription', 0)");
            migrationBuilder.Sql("INSERT NotificationTypes (Name, IsDeleted) VALUES ('Individual Vendor Subscription', 0)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
