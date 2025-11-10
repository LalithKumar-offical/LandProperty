using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface IEmail
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
