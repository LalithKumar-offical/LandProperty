using LandProperty.Contract.DTO;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUser _userService;

        public UserController(IUser userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] RegisterUserDto dto)
        {
            var newUser = await _userService.AddUserAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newUser.UserId }, newUser);
        }

        [HttpPut]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> Update([FromBody] UserDto dto)
        {
            var user = await _userService.GetUserByIdAsync(dto.UserId);
            if (user == null)
                return NotFound("User not found");

            if (!string.IsNullOrWhiteSpace(dto.UserName))
                user.UserName = dto.UserName;

            if (!string.IsNullOrWhiteSpace(dto.UserEmail))
                user.UserEmail = dto.UserEmail;

            if (!string.IsNullOrWhiteSpace(dto.UserPhoneNo))
                user.UserPhoneNo = dto.UserPhoneNo;

            if (dto.UserBalance.HasValue)
                user.UserBalance = dto.UserBalance.Value;

            var updated = await _userService.UpdateUserAsync(user);

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}