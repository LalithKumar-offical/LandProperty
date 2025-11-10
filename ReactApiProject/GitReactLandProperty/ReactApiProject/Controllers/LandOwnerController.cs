using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static LandProperty.Contract.DTO.LandDocumentsDTO;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LandOwnerController : ControllerBase
    {
        private readonly IlandOwner _landService;

        public LandOwnerController(IlandOwner landService)
        {
            _landService = landService;
        }

        // ====== CRUD ======

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _landService.GetAllLandsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var land = await _landService.GetLandByIdAsync(id);
            return land == null ? NotFound() : Ok(land);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId)
        {
            return Ok(await _landService.GetLandsByUserAsync(userId));
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateLandDto dto)
        {
            await _landService.AddLandAsync(dto);
            return Ok("Land added successfully");
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateLandDto dto)
        {
            await _landService.UpdateLandAsync(dto);
            return Ok("Land updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _landService.DeleteLandAsync(id);
            return Ok("Land deleted successfully");
        }

        // ====== APPROVAL ======

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            bool result = await _landService.ApproveLandAsync(id);
            return result ? Ok("Land approved") : NotFound("Land not found");
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id, [FromBody] string reason)
        {
            bool result = await _landService.RejectLandAsync(id, reason);
            return result ? Ok("Land rejected") : NotFound("Land not found");
        }

        // ====== FILE UPLOAD ======

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadDocument([FromForm] UploadLandDocumentRequest request)
        {
            var result = await _landService.UploadLandDocumentAsync(
                request.LandId,
                request.File,
                request.Type
            );
            return Ok(result);
        }

        // ====== DOCUMENTS ======

        [HttpGet("{landId}/documents")]
        public async Task<IActionResult> GetDocuments(int landId)
        {
            var docs = await _landService.GetDocumentsByLandIdAsync(landId);
            return Ok(docs);
        }

        [HttpGet("{landId}/documents/type/{type}")]
        public async Task<IActionResult> GetDocumentsByType(int landId, DocumentType type)
        {
            var docs = await _landService.GetDocumentsByTypeAsync(landId, type);
            return Ok(docs);
        }

        [HttpDelete("document/{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            await _landService.DeleteDocumentAsync(id);
            return Ok("Document deleted successfully");
        }

        // ====== FILTERS ======

        [HttpGet("approved")]
        public async Task<IActionResult> GetApproved() =>
            Ok(await _landService.GetApprovedLandsAsync());

        [HttpGet("rejected")]
        public async Task<IActionResult> GetRejected() =>
            Ok(await _landService.GetRejectedLandsAsync());

        [HttpGet("pending")]
        public async Task<IActionResult> GetPending() =>
            Ok(await _landService.GetPendingLandsAsync());

        [HttpGet("active")]
        public async Task<IActionResult> GetActive() =>
            Ok(await _landService.GetActiveLandsAsync());

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] bool? approved, [FromQuery] bool? active, [FromQuery] Guid? userId)
        {
            var result = await _landService.FilterLandsAsync(approved, active, userId);
            return Ok(result);
        }
    }
}
                