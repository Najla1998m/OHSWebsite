using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateCancelSubscriptionReasonsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET IDENTITY_INSERT [CancelSubscriptionReasons] ON INSERT [CancelSubscriptionReasons] ([Id], [Name], [IsVisible], [IsDeleted]) VALUES (1, N'Lack of required skills',1 , 0) SET IDENTITY_INSERT [CancelSubscriptionReasons] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [CancelSubscriptionReasons] ON INSERT [CancelSubscriptionReasons] ([Id], [Name], [IsVisible], [IsDeleted]) VALUES (2, N'Lack of expertise',1 , 0) SET IDENTITY_INSERT [CancelSubscriptionReasons] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [CancelSubscriptionReasons] ON INSERT [CancelSubscriptionReasons] ([Id], [Name], [IsVisible], [IsDeleted]) VALUES (3, N'Lack of appropriate certificates',1 , 0) SET IDENTITY_INSERT [CancelSubscriptionReasons] OFF ");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
