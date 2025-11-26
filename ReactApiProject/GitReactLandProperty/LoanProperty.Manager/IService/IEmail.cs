namespace LoanProperty.Manager.IService
{
    public interface IEmail
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}