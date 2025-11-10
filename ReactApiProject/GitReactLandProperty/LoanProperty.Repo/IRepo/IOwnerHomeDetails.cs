using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.Roles;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.IRepo
{
    public interface IOwnerHomeDetails
    {
        Task<IEnumerable<OwnerHomeDetails>> GetAllHomesAsync();
        Task<OwnerHomeDetails?> GetHomeByIdAsync(int homeId);
        Task<IEnumerable<OwnerHomeDetails>> GetHomesByUserAsync(Guid userId);
        Task AddHomeAsync(OwnerHomeDetails entity);
        Task UpdateHomeAsync(OwnerHomeDetails entity);
        Task<bool> ApproveHomeAsync(int homeId);
        Task<bool> RejectHomeAsync(int homeId, string reason);

        // 🆕 Add these for document operations
        Task<IEnumerable<HomeDocuments>> GetDocumentsByHomeIdAsync(int homeId);
        Task<IEnumerable<HomeDocuments>> GetDocumentsByTypeAsync(int homeId, DocumentType type);
        Task<HomeDocuments> SaveFileAsync(int homeId, IFormFile file, DocumentType type, string? extractedText);
        Task DeleteDocumentAsync(int documentId);

        // Filtering
        Task<IEnumerable<OwnerHomeDetails>> FilterHomesAsync(bool? approved = null, bool? active = null, Guid? userId = null);
    }
}

