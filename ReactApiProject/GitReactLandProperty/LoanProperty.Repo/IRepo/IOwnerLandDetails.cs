using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using Microsoft.AspNetCore.Http;

namespace LoanProperty.Repo.IRepo
{
    public interface IOwnerLandDetails
    {
        Task<IEnumerable<OwnerLandDetails>> GetAllLandsAsync();

        Task<OwnerLandDetails?> GetLandByIdAsync(int landId);

        Task<IEnumerable<OwnerLandDetails>> GetLandsByUserAsync(Guid userId);

        Task AddLandAsync(OwnerLandDetails land);

        Task UpdateLandAsync(OwnerLandDetails land);

        Task DeleteLandAsync(int landId);

        Task<IEnumerable<OwnerLandDetails>> GetApprovedLandsAsync();

        Task<IEnumerable<OwnerLandDetails>> GetRejectedLandsAsync();

        Task<IEnumerable<OwnerLandDetails>> GetPendingLandsAsync();

        Task<IEnumerable<OwnerLandDetails>> GetActiveLandsAsync();

        Task<bool> ApproveLandAsync(int landId);

        Task<bool> RejectLandAsync(int landId, string reason);

        Task<LandDocumnets> SaveFileAsync(int landId, IFormFile file, DocumentType type, string? extractedDetails = null);

        Task<IEnumerable<LandDocumnets>> GetDocumentsByLandIdAsync(int landId);

        Task<IEnumerable<LandDocumnets>> GetDocumentsByTypeAsync(int landId, DocumentType type);

        Task<LandDocumnets?> GetDocumentByIdAsync(int documentId);

        Task AddLandDocumentAsync(LandDocumnets document);

        Task UpdateDocumentAsync(LandDocumnets document);

        Task DeleteDocumentAsync(int documentId);

        Task<IEnumerable<OwnerLandDetails>> FilterLandsAsync(bool? approved = null, bool? active = null, Guid? userId = null);
        Task<List<OwnerLandDetails>> GetLandsWithOwnerAndDocumentsAsync();
    }
}