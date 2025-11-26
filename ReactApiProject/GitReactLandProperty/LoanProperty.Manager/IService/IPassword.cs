namespace LoanProperty.Manager.IService
{
    public interface IPassword
    {
        string HashPassword(string plainPassword);

        bool VerifyPassword(string enteredPassword, string storedHash);
    }
}