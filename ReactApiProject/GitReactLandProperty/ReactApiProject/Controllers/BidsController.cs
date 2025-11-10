using LandProperty.Contract.DTO;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ✅ only logged-in users can access bid operations
    public class BidsController : ControllerBase
    {
        private readonly IBids _bidsService;
        public BidsController(IBids bidsService)
        {
            _bidsService = bidsService;
        }

        // 🔹 POST: api/Bids  -> Place a new bid (user placing bid)
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddBid([FromBody] CreateBidDto dto)
        {
            await _bidsService.AddBidAsync(dto);
            return Ok(new { Message = "Bid placed successfully." });
        }

        // 🔹 PUT: api/Bids  -> Update or counter a bid (owner or user)
        [HttpPut]
        [Authorize(Roles = "PropertyOwner")]
        public async Task<IActionResult> UpdateBid([FromBody] BidResponseDto dto)
        {
            await _bidsService.UpdateBidAsync(dto);
            return Ok(new { Message = "Bid updated successfully." });
        }

        // 🔹 GET: api/Bids/{id}  -> Get bid details by bid ID
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var bid = await _bidsService.GetBidByIdAsync(id);
            if (bid == null)
                return NotFound(new { Message = "Bid not found." });

            return Ok(bid);
        }

        // 🔹 GET: api/Bids/user/{userId}  -> Get all bids placed by a specific user
        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetBidsByUser(Guid userId)
        {
            var bids = await _bidsService.GetBidsByUserAsync(userId);
            return Ok(bids);
        }

        // 🔹 GET: api/Bids/property  -> Get all bids by property (home or land)
        // Example: /api/Bids/property?homeId=3 OR /api/Bids/property?landId=2
        [HttpGet("property")]
        [Authorize(Roles ="Admin,PropertyOwner")]

        public async Task<IActionResult> GetBidsByProperty([FromQuery] int? homeId = null, [FromQuery] int? landId = null)
        {
            var bids = await _bidsService.GetBidsByPropertyAsync(homeId, landId);
            return Ok(bids);
        }
    }
}
