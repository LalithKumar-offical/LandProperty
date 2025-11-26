using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnerDashboardController : ControllerBase
    {
        private readonly IHomeOwner _homeOwnerService;
        private readonly IlandOwner _landOwnerService;

        public OwnerDashboardController(
            IHomeOwner homeOwnerService,
            IlandOwner landOwnerService)
        {
            _homeOwnerService = homeOwnerService;
            _landOwnerService = landOwnerService;
        }

        [HttpGet("summary")]
        [Authorize(Roles = "PropertyOwner")]
        public async Task<IActionResult> GetOwnerSummary(Guid userId)
        {
            var homes = await _homeOwnerService.GetHomesByUserAsync(userId);
            var lands = await _landOwnerService.GetLandsByUserAsync(userId);

            var homeCount = homes.Count();
            var pendingHomes = homes.Count(h => h.Status == false);
            var approvedHomes = homes.Count(h => h.Status == true);

            var landCount = lands.Count();
            var pendingLands = lands.Count(l => l.Status == false);
            var approvedLands = lands.Count(l => l.Status == true);

            return Ok(new
            {
                totalHomes = homeCount,
                totalLands = landCount,

                pendingHomes,
                approvedHomes,
                pendingLands,
                approvedLands,

                homes,
                lands
            });
        }
    }
}