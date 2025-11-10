using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static LandProperty.Contract.DTO.HomeDocumentsDTO;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 Require authentication globally
    public class HomeOwnerController : ControllerBase
    {
        private readonly IHomeOwner _homeOwnerService;

        public HomeOwnerController(IHomeOwner homeOwnerService)
        {
            _homeOwnerService = homeOwnerService;
        }

        // ================== BASIC CRUD ==================

        // 👀 Everyone (Admin, PropertyOwner, User) can view all homes
        [HttpGet]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetAll() =>
            Ok(await _homeOwnerService.GetAllHomesAsync());

        // 👀 Everyone can view by ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var home = await _homeOwnerService.GetHomeByIdAsync(id);
            return home == null ? NotFound() : Ok(home);
        }

        // 🏠 PropertyOwner only can add new home listings
        [HttpPost]
        [Authorize(Roles = "PropertyOwner")]
        public async Task<IActionResult> Add([FromBody] CreateHomeDto dto)
        {
            await _homeOwnerService.AddHomeAsync(dto);
            return Ok("Home added successfully");
        }

        // ✏️ PropertyOwner only can update their own home details
        [HttpPut]
        [Authorize(Roles = "PropertyOwner")]
        public async Task<IActionResult> Update([FromBody] UpdateHomeDto dto)
        {
            await _homeOwnerService.UpdateHomeAsync(dto);
            return Ok("Home updated successfully");
        }

        // ================== DOCUMENT MANAGEMENT ==================

        // 📤 PropertyOwner uploads, Admin may review
        [HttpPost("upload")]
        [Authorize(Roles = "PropertyOwner,Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadDocument([FromForm] UploadHomeDocumentRequest request)
        {
            var result = await _homeOwnerService.UploadHomeDocumentAsync(
                request.HomeId,
                request.File,
                request.Type
            );
            return Ok(result);
        }

        // 📄 Everyone can view documents for a property
        [HttpGet("{homeId}/documents")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetDocuments(int homeId)
        {
            var docs = await _homeOwnerService.GetDocumentsByHomeIdAsync(homeId);
            return Ok(docs);
        }

        // 🔍 Everyone can view documents by type
        [HttpGet("{homeId}/documents/type/{type}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetDocumentsByType(int homeId, DocumentType type)
        {
            var docs = await _homeOwnerService.GetDocumentsByTypeAsync(homeId, type);
            return Ok(docs);
        }

        // ❌ Only Admin can delete a document
        [HttpDelete("documents/{documentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDocument(int documentId)
        {
            await _homeOwnerService.DeleteDocumentAsync(documentId);
            return Ok("Document deleted successfully");
        }

        // ================== ADMIN ACTIONS ==================

        // ✅ Only Admin can approve
        [HttpPut("{homeId}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveHome(int homeId)
        {
            var success = await _homeOwnerService.ApproveHomeAsync(homeId);
            return success ? Ok("Home approved successfully") : BadRequest("Approval failed");
        }

        // ❌ Only Admin can reject
        [HttpPut("{homeId}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectHome(int homeId, [FromQuery] string reason)
        {
            var success = await _homeOwnerService.RejectHomeAsync(homeId, reason);
            return success ? Ok("Home rejected successfully") : BadRequest("Rejection failed");
        }

        // ================== FILTER & STATUS VIEWS ==================

        // 🔍 Everyone can use filter (User sees all, Admin filters approvals)
        [HttpGet("filter")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> FilterHomes([FromQuery] bool? approved, [FromQuery] bool? active, [FromQuery] Guid? userId)
        {
            var filtered = await _homeOwnerService.FilterHomesAsync(approved, active, userId);
            return Ok(filtered);
        }

        // ✅ Only Admin can view all approved homes
        [HttpGet("approved")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetApprovedHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(true, null, null);
            return Ok(homes);
        }

        // ❌ Only Admin can view rejected homes
        [HttpGet("rejected")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRejectedHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(false, null, null);
            return Ok(homes);
        }

        // 🕓 Pending — only Admin
        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(null, null, null);
            var pending = homes.Where(h => h.RejectedReason == null && !h.HomeStatusApproved);
            return Ok(pending);
        }

        // 🏡 Active homes — visible to everyone
        [HttpGet("active")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetActiveHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(null, true, null);
            return Ok(homes);
        }
    }
}
