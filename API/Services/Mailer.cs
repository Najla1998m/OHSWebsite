using System;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MimeKit;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace API.Services
{
    public class Mailer : IMailer
    {
        private readonly SmtpSettings _smtSettings;
        private readonly IWebHostEnvironment _env;
        public Mailer(IOptions<SmtpSettings> smtSettings, IWebHostEnvironment env)
        {
            _env = env;
            _smtSettings = smtSettings.Value;
        }

        public async Task SendContactUsAsync(ContactUsMessageSendMailDto supportSendEmailDto)
        {
            try
            {
                var sendGridClient = new SendGridClient(_smtSettings.SendGridApiKey);
                var sendGridMessage = new SendGridMessage();
                sendGridMessage.SetFrom(_smtSettings.SenderEmail, _smtSettings.SenderName);
                sendGridMessage.AddTo(supportSendEmailDto.Email, "");
                sendGridMessage.SetTemplateId(_smtSettings.TemplateIdSendReplyMail);
                sendGridMessage.SetTemplateData(new EmailTemplateForSendingReplyDto
                {
                    UserFullName = supportSendEmailDto.UserFullName,
                    Mobile = supportSendEmailDto.Mobile,
                    Email = supportSendEmailDto.Email,
                    Message = supportSendEmailDto.Message,

                });
                var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            }
            catch (System.Exception e)
            {
                throw new InvalidOperationException(e.Message);
            }
        }
        public async Task SendContactUsCustomerCareAsync(ContactUsMessageSendMailDto supportSendEmailDto)
        {
            try
            {
                var sendGridClient = new SendGridClient(_smtSettings.SendGridApiKey);
                var sendGridMessage = new SendGridMessage();
                sendGridMessage.SetFrom(_smtSettings.SenderEmail, _smtSettings.SenderName);
                sendGridMessage.AddTo(supportSendEmailDto.Email, "");
                sendGridMessage.SetTemplateId(_smtSettings.TemplateIdSendCustomerCareMail);
                sendGridMessage.SetTemplateData(new EmailTemplateForSendingReplyDto
                {
                    UserFullName = supportSendEmailDto.UserFullName,
                    Mobile = supportSendEmailDto.Mobile,
                    Email = supportSendEmailDto.Email,
                    Message = supportSendEmailDto.Message,

                });
                var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            }
            catch (System.Exception e)
            {
                throw new InvalidOperationException(e.Message);
            }
        }

        public async Task SendEmailAsync(string email, string subject, string body, string name, int companyId)
        {
            try
            {
                var sendGridClient = new SendGridClient(_smtSettings.SendGridApiKey);
                var sendGridMessage = new SendGridMessage();
                sendGridMessage.SetFrom(_smtSettings.SenderEmail, _smtSettings.SenderName);
                sendGridMessage.AddTo(email, "");
                sendGridMessage.SetTemplateId(_smtSettings.TemplateId);
                sendGridMessage.SetTemplateData(new EmailTemplate
                {
                    UserFullName = name,
                    LoginURL = companyId == 1
                                ? "https://admin.ohsjoeq.com/login"
                                : "https://ohsjoeq.com/auth/login",
                    NewPassword = body,
                    Subject = subject,
                });
                var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            }
            catch (System.Exception e)
            {
                throw new InvalidOperationException(e.Message);
            }

        }

        public async Task SendEmailSendGridAsync(string templeteId, SendGridEmailTemplate sendGridEmailTemplate, string email)
        {
            try
            {
                var sendGridClient = new SendGridClient(_smtSettings.SendGridApiKey);
                var sendGridMessage = new SendGridMessage();
                sendGridMessage.SetFrom(_smtSettings.SenderEmail, _smtSettings.SenderName);
                sendGridMessage.AddTo(email, "");
                sendGridMessage.SetTemplateId(templeteId);
                sendGridMessage.SetTemplateData(sendGridEmailTemplate);
                var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            }
            catch (System.Exception e)
            {
                throw new InvalidOperationException(e.Message);
            }
        }

        public async Task SupportSendEmailAsync(SupportSendEmailDto supportSendEmailDto)
        {
            try
            {
                var sendGridClient = new SendGridClient(_smtSettings.SendGridApiKey);
                var sendGridMessage = new SendGridMessage();
                sendGridMessage.SetFrom(_smtSettings.SenderEmail, _smtSettings.SenderName);
                sendGridMessage.AddTo(supportSendEmailDto.Email, "");
                sendGridMessage.SetTemplateId(_smtSettings.TemplateIdSendReplyMail);
                sendGridMessage.SetTemplateData(new EmailTemplateForSendingReplyDto
                {
                    UserFullName = supportSendEmailDto.Name,
                    Reply = supportSendEmailDto.Message,
                    WebsiteURL = "https://ohsjoeq.com"
                });
                var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            }
            catch (System.Exception e)
            {
                throw new InvalidOperationException(e.Message);
            }
        }

    }

}