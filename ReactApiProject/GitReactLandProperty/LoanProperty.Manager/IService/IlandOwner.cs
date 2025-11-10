using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using Microsoft.AspNetCore.Http;
using static LandProperty.Contract.DTO.LandDocumentsDTO;

namespace LoanProperty.Manager.IService
{
    public interface IlandOwner
    {
        // ========== CRUD ==========
        Task<IEnumerable<LandListDto>> GetAllLandsAsync();
        Task<LandDetailsDto?> GetLandByIdAsync(int landId);
        Task<IEnumerable<LandListDto>> GetLandsByUserAsync(Guid userId);
        Task AddLandAsync(CreateLandDto dto);
        Task UpdateLandAsync(UpdateLandDto dto);
        Task DeleteLandAsync(int landId);

        // ========== APPROVAL ==========
        Task<bool> ApproveLandAsync(int landId);
        Task<bool> RejectLandAsync(int landId, string reason);

        // ========== FILE UPLOAD ==========
        Task<LandDocumentsDto> UploadLandDocumentAsync(int landId, IFormFile file, DocumentType type);

        // ========== DOCUMENT MANAGEMENT ==========
        Task<IEnumerable<LandDocumentsDto>> GetDocumentsByLandIdAsync(int landId);
        Task<IEnumerable<LandDocumentsDto>> GetDocumentsByTypeAsync(int landId, DocumentType type);
        Task DeleteDocumentAsync(int documentId);

        // ========== FILTERS ==========
        Task<IEnumerable<LandListDto>> GetApprovedLandsAsync();
        Task<IEnumerable<LandListDto>> GetRejectedLandsAsync();
        Task<IEnumerable<LandListDto>> GetPendingLandsAsync();
        Task<IEnumerable<LandListDto>> GetActiveLandsAsync();
        Task<IEnumerable<LandListDto>> FilterLandsAsync(bool? approved = null, bool? active = null, Guid? userId = null);
    }
}
