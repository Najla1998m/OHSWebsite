using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PopulateSettingsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('First Slider Block Title', N'سهولة التعامل', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Second Slider Block Title', N'الإستشارات والتدريب', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Third Slider Block Title', N'تقارير مفصلة', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('First Slider Block Image', 'https://th.bing.com/th/id/R.7414d461bf1f6c332a38aca5d297222d?rik=gHvWKb9rAYLbAA&pid=ImgRaw&r=0', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Second Slider Block Image', 'https://wallsdesk.com/wp-content/uploads/2018/03/Antelope-Canyon-Wallpapers.jpg', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Third Slider Block Image', 'https://th.bing.com/th/id/OIP.Dn92YJxy3ROAUsHMi0U2ogHaE8?pid=ImgDet&w=3504&h=2336&rs=1', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Company Phone', '+96651111111', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Main Headline', N'شركة OHSJOEQ', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Main Brief', N'شركة متخصصة في الصحة والسلامة المهنية وتقديم الإستشارات اللازمة', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Intro Video URL', 'https://www.youtube.com/watch?v=LlHFLJusvIw&t=2s', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Company Map URL', 'https://goo.gl/maps/p4EeTcRTfjpuE3fV8', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Company Mail', 'support_team@ohsjoeq.com', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Facebook URL', 'https://www.facebook.com/', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Twitter URL', 'https://twitter.com/', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Snap URL', 'https://accounts.snapchat.com/', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Instagram URL', 'https://www.instagram.com/', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Youtube URL', 'https://www.youtube.com/?gl=EG&hl=ar', 1, 0)");
            migrationBuilder.Sql("INSERT Settings ([Key], [Value], IsVisible, IsDeleted) VALUES ('Website_Policy', 'https://www.youtube.com/?gl=EG&hl=ar', 1, 0)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
