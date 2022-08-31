using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateRolesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //              Adding Company
            // migrationBuilder.Sql("SET IDENTITY_INSERT [Companies] ON INSERT [Companies] ([Id], [Name], [IsDeleted], [Logo], [EmployeesNumbers], [Website], [MapUrl], [City]) VALUES (1, N'OHS Company', 0, NULL, 100, NULL, NULL, NULL) SET IDENTITY_INSERT [Companies] OFF ");
            //                         Adding Roles
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'05b29ffd-7e7f-4d83-bf12-3d9bb859d452', 0, N'9340d2a4-f4b5-484a-b113-cc4513b849e6', N'OHS Employee', N'OHS EMPLOYEE', N'17f6c3db-3c1c-4893-a51b-d8b2bf50f5ea')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'0e4b1da5-28d5-4ff9-9675-a8b435cfb504', 0, NULL, N'Individual Vendor', N'INDIVIDUAL VENDOR', N'63be21e2-f6c8-4383-b80a-c814cbf333df')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'3612bfbf-8af6-4039-9a8c-28fe7fd57543', 0, N'b209aaeb-ef4f-4ab8-8b54-9c921127131d', N'Company Employee', N'COMPANY EMPLOYEE', N'4613afed-f9de-4922-b02f-5fb72e856384')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'384e9455-ba09-4b08-902e-710669d00b97', 0, NULL, N'Company Vendor', N'COMPANY VENDOR', N'a166ac13-4052-49e5-b8ef-1c9e193bb18a')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'4c26105f-faed-46f4-a343-c6028121655b', 0, N'9340d2a4-f4b5-484a-b113-cc4513b849e6', N'OHS Customer Care', N'OHS CUSTOMER CARE', N'89aab92d-bf89-4c06-87ac-8dfa09583331')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'524edbef-48fa-4dc5-80e8-3f834bca6351', 0, N'9340d2a4-f4b5-484a-b113-cc4513b849e6', N'OHS Department Manager', N'OHS DEPARTMENT MANAGER', N'3869fbc2-e7de-45b4-b5fc-ea84c2969330')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'525309ce-a7cd-443b-8ae6-f845031468fe', 0, N'9340d2a4-f4b5-484a-b113-cc4513b849e6', N'OHS Delegated Admin', N'OHS DELEGATED ADMIN', N'8a620063-9cf6-45d5-8f23-5a8f747dfd7f')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'8e7d8f1d-150f-40f4-8493-d797035579b1', 0, N'b209aaeb-ef4f-4ab8-8b54-9c921127131d', N'Company Supervisor', N'COMPANY SUPERVISOR', N'4743491b-448d-4288-95b6-bbcd7994e7d4')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'9340d2a4-f4b5-484a-b113-cc4513b849e6', 0, NULL, N'OHS Admin', N'OHS ADMIN', N'9c8313b4-0df9-4628-bfe3-def70cd1f55c')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'a109b893-e563-4708-9cce-2b4e4643e293', 0, N'9340d2a4-f4b5-484a-b113-cc4513b849e6', N'OHS IT', N'OHS IT', N'a8e2c664-b1ee-4ed1-b378-75a634782927')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'b209aaeb-ef4f-4ab8-8b54-9c921127131d', 0, NULL, N'Company Admin', N'COMPANY ADMIN', N'dc3372a2-ee53-4831-9702-97724a9323dc')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'b6e868d6-eff5-4a63-bbbb-4b9ff99c44ea', 0, N'b209aaeb-ef4f-4ab8-8b54-9c921127131d', N'Company Departement Manager', N'COMPANY DEPARTEMENT MANAGER', N'0bdcc89e-03c2-40d9-a591-154d4b935858')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'ecb2ded0-84a5-44d6-95a0-77cd551cd612', 0, N'9340d2a4-f4b5-484a-b113-cc4513b849e6', N'OHS Supervisor', N'OHS SUPERVISOR', N'9bcf068c-830f-4a18-a356-86db3068d9cf')");
            migrationBuilder.Sql("INSERT [AspNetRoles] ([Id], [IsDeleted], [ParentId], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'f9f48ce9-5896-450c-ba4f-fa207486a828', 0, N'b209aaeb-ef4f-4ab8-8b54-9c921127131d', N'Company Delegated Admin', N'COMPANY DELEGATED ADMIN', N'71ad1776-1791-4fab-a944-7c0f364bb8e6')");

            // Adding Users
           

            // Adding UsersRoles
            // migrationBuilder.Sql("INSERT [AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'ca50bf21-a0eb-4503-84f8-37881f4cf6ca', N'525309ce-a7cd-443b-8ae6-f845031468fe')");
            // migrationBuilder.Sql("INSERT [AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'169943da-d718-4fb1-9040-838720b6b458', N'9340d2a4-f4b5-484a-b113-cc4513b849e6')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
