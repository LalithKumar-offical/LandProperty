using LandProperty.Contract.DTO;
using LandProperty.Data.Data;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly LandPropertyContext _context;
        private readonly IToken _tokenService;
        private readonly IPassword _passwordService;

        public AuthController(LandPropertyContext context, IToken tokenService, IPassword passwordService)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordService = passwordService;
        }

        // 🔹 POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                return BadRequest(new { Message = "Invalid login data." });

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserEmail == loginDto.Email);

            if (user == null)
                return Unauthorized(new { Message = "Invalid email or password." });

            bool isPasswordValid = _passwordService.VerifyPassword(loginDto.Password, user.UserPassword);
            if (!isPasswordValid)
                return Unauthorized(new { Message = "Invalid email or password." });

            // ✅ Generate JWT
            var token = _tokenService.GenerateToken(user);

            // ✅ Store JWT securely in HttpOnly cookie
            Response.Cookies.Append("jwtToken", token, new CookieOptions
            {
                HttpOnly = true,                     // prevents JavaScript access
                Secure = true,                       // only sent over HTTPS
                SameSite = SameSiteMode.Strict,      // protects from CSRF
                Expires = DateTime.UtcNow.AddHours(2)
            });

            // ✅ Return minimal info — don’t return token in response body
            return Ok(new
            {
                Message = "Login successful",
                User = new
                {
                    user.UserId,
                    user.UserName,
                    user.UserEmail,
                    Role = user.Role?.RoleTypeNo.ToString()
                }
            });
        }

        // 🔹 POST: api/Auth/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // ✅ Delete the cookie on logout
            Response.Cookies.Delete("jwtToken");
            return Ok(new { Message = "Logged out successfully." });
        }

        // 🔹 POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool userExists = await _context.Users.AnyAsync(u => u.UserEmail == registerDto.UserEmail);
            if (userExists)
                return BadRequest(new { Message = "Email already registered." });

            var newUser = new User
            {
                UserId = Guid.NewGuid(),
                UserName = registerDto.UserName,
                UserEmail = registerDto.UserEmail,
                UserPhoneNo = registerDto.UserPhoneNo,
                UserPassword = _passwordService.HashPassword(registerDto.UserPassword),
                RoleId = 2 // default User
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }
    }
}
