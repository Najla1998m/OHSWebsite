using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulatePackageCriteriaTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (1, N'خدمات ميدانية', N'Bool') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (2, N'عروض مزودي الخدمة', N'Bool') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (3, N'المجلة الشهرية', N'Bool') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (4, N'التقارير', N'Text') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (5, N'خدمات التدريب والإستشارة', N'Bool') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (6, N'المؤتمرات', N'Text') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (7, N'الدعم الفني', N'Bool') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (8, N'المدة', N'Text') SET IDENTITY_INSERT [PackageCriterias] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [PackageCriterias] ON INSERT [PackageCriterias] ([Id], [Name], [Type]) VALUES (9, N'عدد الموظفين', N'Number') SET IDENTITY_INSERT [PackageCriterias] OFF ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
