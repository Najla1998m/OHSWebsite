using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMailer
    {
        Task SendEmailAsync(string email, string subject, string body, string name,int companyId);
        Task SendEmailSendGridAsync(string templeteId, SendGridEmailTemplate sendGridEmailTemplate, string email);
        Task SupportSendEmailAsync(SupportSendEmailDto supportSendEmailDto);
        Task SendContactUsAsync(ContactUsMessageSendMailDto supportSendEmailDto);
        Task SendContactUsCustomerCareAsync(ContactUsMessageSendMailDto supportSendEmailDto);
    }
}