using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace API.Controllers
{
    public class SendMailController : BaseApiController
    {
        private readonly IMailer _mailer;
        public SendMailController(IMailer mailer)
        {
            _mailer = mailer;
        }

        // [HttpPost]
        // public void SendMail(SendMailDto sendMailDto)
        // {
        //     _mailer.SupportSendEmailAsync(sendMailDto.Email, sendMailDto.Subject, sendMailDto.Body,sendMailDto.Name);
        // }

        //[HttpGet]
        //public async Task SendMailNewAsync()
        //{


        //    //MailMessage mail = new MailMessage();
        //    //mail.To.Add("amryasin1@gmail.com");
        //    //mail.From = new MailAddress("support_team@ohsjoeq.com");
        //    //mail.Subject = "Test Mail";
        //    //mail.Body = "Test Mail ";
        //    //mail.IsBodyHtml = true;
        //    //SmtpClient smtp = new SmtpClient("relay-hosting.secureserver.net", 25);
        //    //smtp.EnableSsl = true;
        //    //smtp.UseDefaultCredentials = false;
        //    //smtp.Credentials = new System.Net.NetworkCredential("support_team@ohsjoeq.com", "Admin.2030");
        //    //smtp.Send(mail);
        //    //Ok();



        //    //SmtpClient smtp = new SmtpClient
        //    //{
        //    //    Host = "relay-hosting.secureserver.net",
        //    //    Port = 25,
        //    //    UseDefaultCredentials = false,
        //    //    DeliveryMethod = SmtpDeliveryMethod.Network,
        //    //    Credentials = new NetworkCredential("support_team@ohsjoeq.com", "Admin.2030"),
        //    //    EnableSsl = false,
        //    //    //  Timeout = 10000
        //    //};

        //    //MailMessage message = new MailMessage();
        //    //message.Body = "hello there";
        //    //message.Subject = "hi!!";
        //    //message.To.Add(new MailAddress("a.ibrahim@excp.sa"));
        //    //message.From = new MailAddress("support_team@ohsjoeq.com");
        //    //smtp.Send(message);





        //    var apiKey = "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";
        //    var client = new SendGridClient(apiKey);
        //    var from = new EmailAddress("support_team@ohsjoeq.com", "OHS Support");
        //    var subject = "Test Send Mail Using ";
        //    var to = new EmailAddress("amryasin1@gmail.com", "");
        //    var plainTextContent = "Test";
        //    var htmlContent = "<strong>Test</strong>";
        //    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        //    var response = await client.SendEmailAsync(msg).ConfigureAwait(false);





        //    Ok(response.StatusCode == HttpStatusCode.Accepted ? true : false);
        //    //MailMessage message = new MailMessage();
        //    //SmtpClient smtpClient = new SmtpClient();
        //    //string msg = string.Empty;
        //    //try
        //    //{
        //    //    MailAddress fromAddress = new MailAddress("ohsjoeq.customer.care@gmail.com");
        //    //    message.From = fromAddress;
        //    //    message.To.Add("a.ibrahim@excp.sa");
        //    //    message.Subject = "test";
        //    //    message.IsBodyHtml = true;
        //    //    message.Body = "test";
        //    //    smtpClient.Host = "smtp.gmail.com";   //-- Donot change.
        //    //    smtpClient.Port = 465; //--- Donot change
        //    //    smtpClient.EnableSsl = false;//--- Donot change
        //    //    smtpClient.UseDefaultCredentials = true;
        //    //    smtpClient.Credentials = new System.Net.NetworkCredential("ohsjoeq.customer.care@gmail.com", "Admin.2030");

        //    //    smtpClient.Send(message);

        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    msg = ex.Message;
        //    //    Ok(msg);
        //    //}
        //    //Ok(msg);













        [HttpGet("SendSms")]
        public async Task<ActionResult> SendSms(string sms)
        {


            //// Find your Account SID and Auth Token at twilio.com/console
            //// and set the environment variables. See http://twil.io/secure
            //string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            //string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init("AC47f8fb91c510a739c94929242ab20e79", "770d4275485d91334a6f9eafe9561372");

            var message = MessageResource.Create(
                body: sms,
                from: new Twilio.Types.PhoneNumber("+16414581990"),
                to: new Twilio.Types.PhoneNumber("+6414581990")
            );

            Console.WriteLine(message.Sid);

            return Ok("");
        }
        //    //_mailer.SupportSendEmailAsync(sendMailDto.Email, sendMailDto.Subject, sendMailDto.Body);
        //}
    }
}