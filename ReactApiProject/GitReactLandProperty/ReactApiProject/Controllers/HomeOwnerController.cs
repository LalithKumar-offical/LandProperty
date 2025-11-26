using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static LandProperty.Contract.DTO.HomeDocumentsDTO;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class HomeOwnerController : ControllerBase
    {
        private readonly IHomeOwner _homeOwnerService;

        public HomeOwnerController(IHomeOwner homeOwnerService)
        {
            _homeOwnerService = homeOwnerService;
        }
        [HttpGet("full-details")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetHomesWithOwnerAndDocs()
        {
            var data = await _homeOwnerService.GetHomesWithOwnerAndDocumentsAsync();
            return Ok(data);
        }
        [HttpGet]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetAll() =>
            Ok(await _homeOwnerService.GetAllHomesAsync());

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var home = await _homeOwnerService.GetHomeByIdAsync(id);
            return home == null ? NotFound() : Ok(home);
        }

        [HttpPost]
        [Authorize(Roles = "PropertyOwner")]
        public async Task<IActionResult> Add([FromBody] CreateHomeDto dto)
        {
            await _homeOwnerService.AddHomeAsync(dto);
            return Ok("Home added successfully");
        }

        [HttpPut]
        [Authorize(Roles = "PropertyOwner")]
        public async Task<IActionResult> Update([FromBody] UpdateHomeDto dto)
        {
            await _homeOwnerService.UpdateHomeAsync(dto);
            return Ok("Home updated successfully");
        }

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

        [HttpGet("{homeId}/documents")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetDocuments(int homeId)
        {
            var docs = await _homeOwnerService.GetDocumentsByHomeIdAsync(homeId);
            return Ok(docs);
        }

        [HttpGet("{homeId}/documents/type/{type}")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetDocumentsByType(int homeId, DocumentType type)
        {
            var docs = await _homeOwnerService.GetDocumentsByTypeAsync(homeId, type);
            return Ok(docs);
        }

        [HttpDelete("documents/{documentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDocument(int documentId)
        {
            await _homeOwnerService.DeleteDocumentAsync(documentId);
            return Ok("Document deleted successfully");
        }

        [HttpPut("{homeId}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveHome(int homeId)
        {
            var success = await _homeOwnerService.ApproveHomeAsync(homeId);
            return success ? Ok("Home approved successfully") : BadRequest("Approval failed");
        }

        [HttpPut("{homeId}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectHome(int homeId, [FromQuery] string reason)
        {
            var success = await _homeOwnerService.RejectHomeAsync(homeId, reason);
            return success ? Ok("Home rejected successfully") : BadRequest("Rejection failed");
        }

        [HttpGet("filter")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> FilterHomes([FromQuery] bool? approved, [FromQuery] bool? active, [FromQuery] Guid? userId)
        {
            var filtered = await _homeOwnerService.FilterHomesAsync(approved, active, userId);
            return Ok(filtered);
        }

        [HttpGet("approved")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetApprovedHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(true, null, null);
            return Ok(homes);
        }

        [HttpGet("rejected")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRejectedHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(false, null, null);
            return Ok(homes);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(null, null, null);
            var pending = homes.Where(h => h.RejectedReason == null && !h.HomeStatusApproved);
            return Ok(pending);
        }

        [HttpGet("active")]
        [Authorize(Roles = "Admin,PropertyOwner,User")]
        public async Task<IActionResult> GetActiveHomes()
        {
            var homes = await _homeOwnerService.FilterHomesAsync(null, true, null);
            return Ok(homes);
        }
    }
}