using LoanProperty.Manager.IService;

namespace LoanProperty.Manager.Implementation
{
    public class PasswordService : IPassword
    {
        public string HashPassword(string plainPassword)
        {
            return BCrypt.Net.BCrypt.HashPassword(plainPassword);
        }

        public bool VerifyPassword(string enteredPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, storedHash);
        }
    }
}