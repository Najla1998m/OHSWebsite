using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateSubscriptionTypesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (1, N'Company Admin Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (2, N'Company Vendor Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (3, N'Individual Vendor Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (4, N'Program Management Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (5, N'Risk Managament Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (6, N'Effective Communications Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (7, N'Competence and skills Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (8, N'Facilities Evaluation Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (9, N'Operations Evaluation Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (10, N'Customers, partners and suppliers Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (11, N'Emergency Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (12, N'OHS Reviews Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (13, N'Administrative review Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (14, N'Community cooperation Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [SubscriptionTypes] ON INSERT [SubscriptionTypes] ([Id], [Name], [IsDeleted]) VALUES (15, N'Continuous development Subscription', 0) SET IDENTITY_INSERT [SubscriptionTypes] OFF ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
