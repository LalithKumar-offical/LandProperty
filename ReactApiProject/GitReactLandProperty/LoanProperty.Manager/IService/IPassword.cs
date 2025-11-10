using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface IPassword
    {
        string HashPassword(string plainPassword);
        bool VerifyPassword(string enteredPassword, string storedHash);
    }
}
