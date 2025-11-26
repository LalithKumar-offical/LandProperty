using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using Microsoft.AspNetCore.Http;
using static LandProperty.Contract.DTO.HomeDocumentsDTO;

namespace LoanProperty.Manager.IService
{
    public interface IHomeOwner
    {
        Task<IEnumerable<HomeListDto>> GetAllHomesAsync();

        Task<HomeDetailsDto?> GetHomeByIdAsync(int homeId);

        Task<IEnumerable<HomeListDto>> GetHomesByUserAsync(Guid userId);

        Task AddHomeAsync(CreateHomeDto dto);

        Task UpdateHomeAsync(UpdateHomeDto dto);

        Task<bool> ApproveHomeAsync(int homeId);

        Task<bool> RejectHomeAsync(int homeId, string reason);

        Task<HomeDocumentsDto> UploadHomeDocumentAsync(int homeId, IFormFile file, DocumentType type);

        Task<IEnumerable<HomeDocumentsDto>> GetDocumentsByHomeIdAsync(int homeId);

        Task<IEnumerable<HomeDocumentsDto>> GetDocumentsByTypeAsync(int homeId, DocumentType type);

        Task DeleteDocumentAsync(int documentId);

        Task<IEnumerable<HomeListDto>> FilterHomesAsync(bool? approved = null, bool? active = null, Guid? userId = null);

        Task<List<HomeWithOwnerAndDocumentsDto>> GetHomesWithOwnerAndDocumentsAsync();
    }
}