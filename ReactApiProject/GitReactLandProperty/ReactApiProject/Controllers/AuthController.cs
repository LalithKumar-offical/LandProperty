using LandProperty.Contract.DTO;
using LandProperty.Data.Data;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Invalid login data."
                });
            }
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserEmail == loginDto.Email);

            if (user == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Invalid email or password."
                });
            }

            bool isPasswordValid = _passwordService.VerifyPassword(loginDto.Password, user.UserPassword);
            if (!isPasswordValid)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Invalid email or password."
                });
            }

            var token = _tokenService.GenerateToken(user);

            Response.Cookies.Append("jwtToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(2)
            });

            return Ok(new
            {
                Success = true,
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

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwtToken");
            return Ok(new { Message = "Logged out successfully." });
        }

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
                RoleId = 2
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }
    }
}