using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface IToken
    {
        string GenerateToken(User user);
    }
}
