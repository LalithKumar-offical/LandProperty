using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IUser _userService;
        private readonly IHomeOwner _homeOwnerService;
        private readonly IlandOwner _landOwnerService;

        public AdminDashboardController(
            IUser userService,
            IHomeOwner homeOwnerService,
            IlandOwner landOwnerService)
        {
            _userService = userService;
            _homeOwnerService = homeOwnerService;
            _landOwnerService = landOwnerService;
        }

        [HttpGet("summary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSummary()
        {
            var users = await _userService.GetAllUsersAsync();
            var homes = await _homeOwnerService.GetAllHomesAsync();
            var lands = await _landOwnerService.GetAllLandsAsync();

            return Ok(new
            {
                users,
                homes,
                lands
            });
        }
    }
}