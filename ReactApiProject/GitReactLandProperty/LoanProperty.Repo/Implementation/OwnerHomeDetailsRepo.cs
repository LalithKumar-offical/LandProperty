using LandProperty.Data.Data;
using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.Roles;
using LoanProperty.Repo.IRepo;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LoanProperty.Repo.Implementation
{
    public class OwnerHomeDetailsRepo : IOwnerHomeDetails
    {
        private readonly LandPropertyContext _context;
        private readonly string _uploadRoot;

        public OwnerHomeDetailsRepo(LandPropertyContext context)
        {
            _context = context;
            _uploadRoot = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            Directory.CreateDirectory(_uploadRoot);
        }

        public async Task<IEnumerable<OwnerHomeDetails>> GetAllHomesAsync()
        {
            return await _context.OwnerHomeDetails
                .Include(h => h.HomeDocuments)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<OwnerHomeDetails?> GetHomeByIdAsync(int homeId)
        {
            return await _context.OwnerHomeDetails
                .Include(h => h.HomeDocuments)
                .FirstOrDefaultAsync(h => h.HomeId == homeId);
        }

        public async Task<IEnumerable<OwnerHomeDetails>> GetHomesByUserAsync(Guid userId)
        {
            return await _context.OwnerHomeDetails
                .Include(h => h.HomeDocuments)
                .Where(h => h.UserId == userId)
                .ToListAsync();
        }

        public async Task AddHomeAsync(OwnerHomeDetails home)
        {
            await _context.OwnerHomeDetails.AddAsync(home);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateHomeAsync(OwnerHomeDetails home)
        {
            _context.OwnerHomeDetails.Update(home);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteHomeAsync(int homeId)
        {
            var home = await _context.OwnerHomeDetails.FindAsync(homeId);
            if (home != null)
            {
                _context.OwnerHomeDetails.Remove(home);
                await _context.SaveChangesAsync();
            }
        }

        // ==================== HOME FILTERS ====================

        public async Task<IEnumerable<OwnerHomeDetails>> GetApprovedHomesAsync()
        {
            return await _context.OwnerHomeDetails
                .Where(h => h.HomeStatusApproved)
                .Include(h => h.HomeDocuments)
                .ToListAsync();
        }

        public async Task<IEnumerable<OwnerHomeDetails>> GetRejectedHomesAsync()
        {
            return await _context.OwnerHomeDetails
                .Where(h => !h.HomeStatusApproved && h.RejectedReason != null)
                .Include(h => h.HomeDocuments)
                .ToListAsync();
        }

        public async Task<IEnumerable<OwnerHomeDetails>> GetPendingHomesAsync()
        {
            return await _context.OwnerHomeDetails
                .Where(h => !h.HomeStatusApproved && h.RejectedReason == null)
                .Include(h => h.HomeDocuments)
                .ToListAsync();
        }

        public async Task<IEnumerable<OwnerHomeDetails>> GetActiveHomesAsync()
        {
            return await _context.OwnerHomeDetails
                .Where(h => h.Status)
                .Include(h => h.HomeDocuments)
                .ToListAsync();
        }

        public async Task<bool> ApproveHomeAsync(int homeId)
        {
            var home = await _context.OwnerHomeDetails.FindAsync(homeId);
            if (home == null) return false;

            home.HomeStatusApproved = true;
            home.RejectedReason = null;
            _context.OwnerHomeDetails.Update(home);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectHomeAsync(int homeId, string reason)
        {
            var home = await _context.OwnerHomeDetails.FindAsync(homeId);
            if (home == null) return false;

            home.HomeStatusApproved = false;
            home.RejectedReason = reason;
            _context.OwnerHomeDetails.Update(home);
            await _context.SaveChangesAsync();
            return true;
        }

        // ==================== DOCUMENTS & FILES ====================

        public async Task<HomeDocuments> SaveFileAsync(int homeId, IFormFile file, DocumentType type, string? extractedDetails = null)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file upload.");

            // Choose subfolder based on DocumentType
            string folder = type switch
            {
                DocumentType.Image => "Images",
                DocumentType.Vedio => "Videos",
                DocumentType.Documnet => "Documents",
                _ => "Others"
            };

            string folderPath = Path.Combine(_uploadRoot, folder);
            Directory.CreateDirectory(folderPath);

            string fileName = $"{Guid.NewGuid()}_{file.FileName}";
            string fullPath = Path.Combine(folderPath, fileName);

            // Save file to disk
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save record in DB
            var doc = new HomeDocuments
            {
                HomeId = homeId,
                DocumentType = type,
                DocumentPath = fullPath,

                DocumentDetailsExtracted = extractedDetails
            };

            await _context.HomeDocuments.AddAsync(doc);
            await _context.SaveChangesAsync();

            return doc;
        }

        public async Task<IEnumerable<HomeDocuments>> GetDocumentsByHomeIdAsync(int homeId)
        {
            return await _context.HomeDocuments
                .Where(d => d.HomeId == homeId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<HomeDocuments>> GetDocumentsByTypeAsync(int homeId, DocumentType type)
        {
            return await _context.HomeDocuments
                .Where(d => d.HomeId == homeId && d.DocumentType == type)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<HomeDocuments?> GetDocumentByIdAsync(int documentId)
        {
            return await _context.HomeDocuments
                .FirstOrDefaultAsync(d => d.HomeDocumnetsId == documentId);
        }
             
        public async Task AddHomeDocumentAsync(HomeDocuments document)
        {
            await _context.HomeDocuments.AddAsync(document);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDocumentAsync(HomeDocuments document)
        {
            _context.HomeDocuments.Update(document);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDocumentAsync(int documentId)
        {
            var doc = await _context.HomeDocuments.FindAsync(documentId);
            if (doc != null)
            {
                if (!string.IsNullOrEmpty(doc.DocumentPath) && File.Exists(doc.DocumentPath))
                    File.Delete(doc.DocumentPath);

                _context.HomeDocuments.Remove(doc);
                await _context.SaveChangesAsync();
            }
        }

        // ==================== SMART FILTER ====================

        public async Task<IEnumerable<OwnerHomeDetails>> FilterHomesAsync(bool? approved = null, bool? active = null, Guid? userId = null)
        {
            var query = _context.OwnerHomeDetails
                .Include(h => h.HomeDocuments)
                .AsQueryable();

            if (approved.HasValue)
                query = query.Where(h => h.HomeStatusApproved == approved.Value);

            if (active.HasValue)
                query = query.Where(h => h.Status == active.Value);

            if (userId.HasValue)
                query = query.Where(h => h.UserId == userId.Value);

            return await query.ToListAsync();
        }
    }
}
