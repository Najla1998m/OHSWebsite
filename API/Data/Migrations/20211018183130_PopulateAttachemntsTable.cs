using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateAttachemntsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (1, N'بناء الإستراتيجية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (2, N'ذكاء الأعمال',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (3, N'تطوير الأعمال',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (4, N'مؤشرات الأداء',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (5, N'PMP',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (6, N'القيادة بفاعلية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (7, N'التعرف علي المخاطر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (8, N'تقييم المخاطر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (9, N'إدارة المخاطر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (10, N'مهارات التواصل',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (11, N'التواصل الفعال',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (12, N'تحليل البيانات',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (13, N'تحليل الإحتياجات التدريبية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (14, N'التعرف علي المخاطر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (15, N'إدارة الأصول الثابتة',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (16, N'التعرف علي المخاطر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (17, N'المراجعة الميدانية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (18, N'إدارة الإنتاج',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (19, N'إدارة العمليات',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (20, N'إدارة الفريق',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (21, N'الإشراف والمتابعة',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (22, N'الشراكات الإستراتيجية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (23, N'دراسة رضا العملاء',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (24, N'رضا العملاء',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (25, N'التسويق',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (26, N'علاقات العملاء',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (27, N'إدارة المخاطر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (28, N'إدارة حالات الطواريء',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (29, N'إدارة سلوك السلامة والصحة المهنية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (30, N'مؤشرات السلامة التوقعية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (31, N'مراجع نظام سلامة وصحة مهنية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (32, N'مراجع داخلي',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (33, N'النتيجة والأثر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (34, N'المبادرات والفعاليات',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (35, N'التواصل الفعال',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (36, N'6 سيجما',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (37, N'تحليل البيانات',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (38, N'التطوير المستمر',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (39, N'السجل التجاري للشركة',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (40, N'شهادة الصحة والسلامة المهنية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (41, N'السجل التجاري',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (42, N'شهادة الصحة والسلامة المهنية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
            migrationBuilder.Sql("SET IDENTITY_INSERT [Attachments] ON INSERT [Attachments] ([Id], [Name], [IsOptional], [IsVisible], [IsDeleted]) VALUES (43, N'الصورة الشخصية',1, 1, 0) SET IDENTITY_INSERT [Attachments] OFF ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
