using LandProperty.Data.Data;
using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using LoanProperty.Repo.IRepo;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Repo.Implementation
{
    public class OwnerLandDetailsRepo : IOwnerLandDetails
    {
        private readonly LandPropertyContext _context;
        private readonly string _uploadRoot;

        public OwnerLandDetailsRepo(LandPropertyContext context)
        {
            _context = context;
            _uploadRoot = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            Directory.CreateDirectory(_uploadRoot);
        }


        public async Task<IEnumerable<OwnerLandDetails>> GetAllLandsAsync()
        {
            return await _context.OwnerLandDetails
                .Include(l => l.LandDocuments)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<OwnerLandDetails?> GetLandByIdAsync(int landId)
        {
            return await _context.OwnerLandDetails
                .Include(l => l.LandDocuments)
                .FirstOrDefaultAsync(l => l.LandId == landId);
        }

        public async Task<IEnumerable<OwnerLandDetails>> GetLandsByUserAsync(Guid userId)
        {
            return await _context.OwnerLandDetails
                .Include(l => l.LandDocuments)
                .Where(l => l.UserId == userId)
                .ToListAsync();
        }

        public async Task AddLandAsync(OwnerLandDetails land)
        {
            await _context.OwnerLandDetails.AddAsync(land);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateLandAsync(OwnerLandDetails land)
        {
            _context.OwnerLandDetails.Update(land);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteLandAsync(int landId)
        {
            var land = await _context.OwnerLandDetails.FindAsync(landId);
            if (land != null)
            {
                _context.OwnerLandDetails.Remove(land);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<OwnerLandDetails>> GetApprovedLandsAsync()
        {
            return await _context.OwnerLandDetails
                .Where(l => l.LandStatusApproved)
                .Include(l => l.LandDocuments)
                .ToListAsync();
        }

        public async Task<IEnumerable<OwnerLandDetails>> GetRejectedLandsAsync()
        {
            return await _context.OwnerLandDetails
                .Where(l => !l.LandStatusApproved && l.RejectedReason != null)
                .Include(l => l.LandDocuments)
                .ToListAsync();
        }

        public async Task<IEnumerable<OwnerLandDetails>> GetPendingLandsAsync()
        {
            return await _context.OwnerLandDetails
                .Where(l => !l.LandStatusApproved && l.RejectedReason == null)
                .Include(l => l.LandDocuments)
                .ToListAsync();
        }

        public async Task<IEnumerable<OwnerLandDetails>> GetActiveLandsAsync()
        {
            return await _context.OwnerLandDetails
                .Where(l => l.Status)
                .Include(l => l.LandDocuments)
                .ToListAsync();
        }

        public async Task<bool> ApproveLandAsync(int landId)
        {
            var land = await _context.OwnerLandDetails.FindAsync(landId);
            if (land == null) return false;

            land.LandStatusApproved = true;
            land.RejectedReason = null;
            _context.OwnerLandDetails.Update(land);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectLandAsync(int landId, string reason)
        {
            var land = await _context.OwnerLandDetails.FindAsync(landId);
            if (land == null) return false;

            land.LandStatusApproved = false;
            land.RejectedReason = reason;
            _context.OwnerLandDetails.Update(land);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<LandDocumnets> SaveFileAsync(int landId, IFormFile file, DocumentType type, string? extractedDetails = null)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file upload.");

            string folder = type switch
            {
                DocumentType.Image => "LandImages",
                DocumentType.Vedio => "LandVideos",
                DocumentType.Documnet => "LandDocuments",
                _ => "Others"
            };

            string folderPath = Path.Combine(_uploadRoot, folder);
            Directory.CreateDirectory(folderPath);

            string fileName = $"{Guid.NewGuid()}_{file.FileName}";
            string fullPath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var doc = new LandDocumnets
            {
                LandId = landId,
                DocumentType = type,
                DocumentPath = fullPath,
                DocumentDetailsExtracted = extractedDetails
            };

            await _context.LandDocuments.AddAsync(doc);
            await _context.SaveChangesAsync();

            return doc;
        }

        public async Task<IEnumerable<LandDocumnets>> GetDocumentsByLandIdAsync(int landId)
        {
            return await _context.LandDocuments
                .Where(d => d.LandId == landId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LandDocumnets>> GetDocumentsByTypeAsync(int landId, DocumentType type)
        {
            return await _context.LandDocuments
                .Where(d => d.LandId == landId && d.DocumentType == type)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<LandDocumnets?> GetDocumentByIdAsync(int documentId)
        {
            return await _context.LandDocuments
                .FirstOrDefaultAsync(d => d.LandDocumentId == documentId);
        }

        public async Task AddLandDocumentAsync(LandDocumnets document)
        {
            await _context.LandDocuments.AddAsync(document);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDocumentAsync(LandDocumnets document)
        {
            _context.LandDocuments.Update(document);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDocumentAsync(int documentId)
        {
            var doc = await _context.LandDocuments.FindAsync(documentId);
            if (doc != null)
            {
                if (!string.IsNullOrEmpty(doc.DocumentPath) && File.Exists(doc.DocumentPath))
                    File.Delete(doc.DocumentPath);

                _context.LandDocuments.Remove(doc);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<OwnerLandDetails>> FilterLandsAsync(bool? approved = null, bool? active = null, Guid? userId = null)
        {
            var query = _context.OwnerLandDetails
                .Include(l => l.LandDocuments)
                .AsQueryable();

            if (approved.HasValue)
                query = query.Where(l => l.LandStatusApproved == approved.Value);

            if (active.HasValue)
                query = query.Where(l => l.Status == active.Value);

            if (userId.HasValue)
                query = query.Where(l => l.UserId == userId.Value);

            return await query.ToListAsync();
        }
        public async Task<List<OwnerLandDetails>> GetLandsWithOwnerAndDocumentsAsync()
        {
            return await _context.OwnerLandDetails
                .Include(l => l.LandDocuments)
                .Include(l => l.User)
                .ToListAsync();
        }

    }
}