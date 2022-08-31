using System;
using API.Data;
using API.Entities;
using API.Helpers;
using API.Helpers.LogError;
using API.Interfaces;
using API.Managers;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<ITokenService, TokenService>();
            // for SqlServer
            services.AddDbContext<DataContext>(options =>
                        {
                            options.UseSqlServer(config["ConnectionStrings:DefaultConnection"]);
                        });

           
            services.Configure<SmtpSettings>(options =>
            {
                options.Password = config.GetValue<string>("SmtpSettings:Password");
                options.Port = config.GetValue<int>("SmtpSettings:Port");
                options.SenderEmail = config.GetValue<string>("SmtpSettings:SenderEmail");
                options.SenderName = config.GetValue<string>("SmtpSettings:SenderName");
                options.Server = config.GetValue<string>("SmtpSettings:Server");
                options.Username = config.GetValue<string>("SmtpSettings:Username");
                options.SupportSenderEmail = config.GetValue<string>("SmtpSettings:SupportSenderEmail");
                options.SupportPassword = config.GetValue<string>("SmtpSettings:SupportPassword");
                options.SupportSenderName = config.GetValue<string>("SmtpSettings:SupportSenderName");
                options.SendGridApiKey = config.GetValue<string>("SmtpSettings:SendGridApiKey");
                options.TemplateId = config.GetValue<string>("SmtpSettings:TemplateId");
                options.TemplateIdSendReplyMail = config.GetValue<string>("SmtpSettings:TemplateIdSendReplyMail");
                options.TemplateIdSendCustomerCareMail = config.GetValue<string>("SmtpSettings:TemplateIdSendCustomerCareMail");
                options.TemplateIdCreatedTask = config.GetValue<string>("SmtpSettings:TemplateIdCreatedTask");
                options.TemplateIdActivaUser = config.GetValue<string>("SmtpSettings:TemplateIdActivaUser");
                options.DeleteSubscriptionTypeAttachmentList = config.GetValue<string>("SmtpSettings:DeleteSubscriptionTypeAttachmentList");
            });
            services.AddSingleton<IMailer, Mailer>();
            services.AddSingleton<IQRCodeCreation, QRCodeCreation>();
            services.AddSingleton<IImageConversion, ImageConversion>();
            services.AddSingleton<ILogError, LogError>();
            services.AddTransient<ITasksManager, TasksManagers>();
            return services;
            
        }
    }
}