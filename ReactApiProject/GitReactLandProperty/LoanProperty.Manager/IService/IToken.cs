using LandProperty.Data.Models.Roles;

namespace LoanProperty.Manager.IService
{
    public interface IToken
    {
        string GenerateToken(User user);
    }
}