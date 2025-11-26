using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LoanProperty.Manager.Implementation
{
    public class TokenService : IToken
    {
        private readonly SymmetricSecurityKey _key;
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]!));
        }

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.UserEmail ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role?.RoleTypeNo.ToString() ?? "User")
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = creds,
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var handler = new JwtSecurityTokenHandler();
            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }
    }
}