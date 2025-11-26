using LandProperty.Contract.DTO;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]  
    public class BidsController : ControllerBase
    {
        private readonly IBids _bidsService;

        public BidsController(IBids bidsService)
        {
            _bidsService = bidsService;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddBid([FromBody] CreateBidDto dto)
        {
            await _bidsService.AddBidAsync(dto);
            return Ok(new { Message = "Bid placed successfully." });
        }

        [HttpPut]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> UpdateBid([FromBody] BidResponseDto dto)
        {
            await _bidsService.UpdateBidAsync(dto);
            return Ok(new { Message = "Bid updated successfully." });
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var bid = await _bidsService.GetBidByIdAsync(id);

            if (bid == null)
                return NotFound(new { Message = "Bid not found." });

            return Ok(bid);
        }

        [HttpGet("user/{userId:guid}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetBidsByUser(Guid userId)
        {
            var bids = await _bidsService.GetBidsByUserAsync(userId);
            return Ok(bids);
        }

        [HttpGet("property")]
        [Authorize(Roles = "Admin,PropertyOwner")]
        public async Task<IActionResult> GetBidsByProperty([FromQuery] int? homeId = null, [FromQuery] int? landId = null)
        {
            var bids = await _bidsService.GetBidsByPropertyAsync(homeId, landId);
            return Ok(bids);
        }

        [HttpGet("owner/{ownerId:guid}")]
        [Authorize(Roles = "PropertyOwner,Admin")]
        public async Task<IActionResult> GetBidsByOwner(Guid ownerId)
        {
            var bids = await _bidsService.GetBidsByOwnerAsync(ownerId);
            return Ok(bids);
        }
    }
}