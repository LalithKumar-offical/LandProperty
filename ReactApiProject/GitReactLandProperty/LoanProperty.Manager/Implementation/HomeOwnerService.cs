using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Text.RegularExpressions;
using Tesseract;
using static LandProperty.Contract.DTO.HomeDocumentsDTO;

namespace LoanProperty.Manager.Implementation
{
    public class HomeOwnerService : IHomeOwner
    {
        private readonly IOwnerHomeDetails _repo;
        private readonly IMapper _mapper;
        private readonly string _tessDataPath;

        public HomeOwnerService(IOwnerHomeDetails repo, IMapper mapper, string tessDataPath)
        {
            _repo = repo;
            _mapper = mapper;
            _tessDataPath = tessDataPath; 
        }

        public async Task<List<HomeWithOwnerAndDocumentsDto>> GetHomesWithOwnerAndDocumentsAsync()
        {
            var homes = await _repo.GetHomesWithOwnerAndDocumentsAsync();
            return _mapper.Map<List<HomeWithOwnerAndDocumentsDto>>(homes);
        }

        public async Task<IEnumerable<HomeListDto>> GetAllHomesAsync()
        {
            var homes = await _repo.GetAllHomesAsync();
            return _mapper.Map<IEnumerable<HomeListDto>>(homes);
        }

        public async Task<HomeDetailsDto?> GetHomeByIdAsync(int homeId)
        {
            var home = await _repo.GetHomeByIdAsync(homeId);
            return _mapper.Map<HomeDetailsDto>(home);
        }

        public async Task<IEnumerable<HomeListDto>> GetHomesByUserAsync(Guid userId)
        {
            var homes = await _repo.GetHomesByUserAsync(userId);
            return _mapper.Map<IEnumerable<HomeListDto>>(homes);
        }

        public async Task AddHomeAsync(CreateHomeDto dto)
        {
            var entity = _mapper.Map<OwnerHomeDetails>(dto);
            await _repo.AddHomeAsync(entity);
        }

        public async Task UpdateHomeAsync(UpdateHomeDto dto)
        {
            var existing = await _repo.GetHomeByIdAsync(dto.HomeId);
            if (existing == null)
                throw new Exception("Home not found");

            _mapper.Map(dto, existing);

            await _repo.UpdateHomeAsync(existing);
        }
        

        public async Task<bool> ApproveHomeAsync(int homeId)
        {
            return await _repo.ApproveHomeAsync(homeId);
        }

        public async Task<bool> RejectHomeAsync(int homeId, string reason)
        {
            return await _repo.RejectHomeAsync(homeId, reason);
        }


        public async Task<HomeDocumentsDto> UploadHomeDocumentAsync(int homeId, IFormFile file, DocumentType type)
        {
            string? extractedText = null;

            if (type == DocumentType.Image || type == DocumentType.Documnet)
                extractedText = await ExtractTextFromFileAsync(file);

            var saved = await _repo.SaveFileAsync(homeId, file, type, extractedText);
            return _mapper.Map<HomeDocumentsDto>(saved);
        }

        private async Task<string?> ExtractTextFromFileAsync(IFormFile file)
        {
            string tempPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}_{file.FileName}");

            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            try
            {
                using var engine = new TesseractEngine(_tessDataPath, "eng", EngineMode.Default);
                using var img = Pix.LoadFromFile(tempPath);
                using var page = engine.Process(img);
                string fullText = page.GetText();

                if (string.IsNullOrWhiteSpace(fullText))
                    return null;

                string filteredDetails = ExtractRequiredData(fullText);
                return filteredDetails;
            }
            catch (Exception ex)
            {
                return $"[OCR Error] {ex.Message}";
            }
            finally
            {
                if (File.Exists(tempPath))
                    File.Delete(tempPath);
            }
        }

        public string ExtractRequiredData(string text)
        {
            string? owner = null;
            string? zoning = null;
            string? lastTransfer = null;

            var ownerMatch = Regex.Match(text, @"(?i)Property\s*Owner[:\-]?\s*(.+)", RegexOptions.IgnoreCase);
            if (ownerMatch.Success)
                owner = ownerMatch.Groups[1].Value.Trim();

            var zoningMatch = Regex.Match(text, @"(?i)Zoning\s*Classification[:\-]?\s*(.+)", RegexOptions.IgnoreCase);
            if (zoningMatch.Success)
                zoning = zoningMatch.Groups[1].Value.Trim();

            var transferMatch = Regex.Match(text, @"(?i)Date\s*of\s*Last\s*Transfer[:\-]?\s*(.+)", RegexOptions.IgnoreCase);
            if (transferMatch.Success)
                lastTransfer = transferMatch.Groups[1].Value.Trim();

            var result = new StringBuilder();
            if (!string.IsNullOrEmpty(owner))
                result.AppendLine($"Owner: {owner}");
            if (!string.IsNullOrEmpty(zoning))
                result.AppendLine($"Zoning Classification: {zoning}");
            if (!string.IsNullOrEmpty(lastTransfer))
                result.AppendLine($"Last Transfer Date: {lastTransfer}");

            return result.Length > 0 ? result.ToString().Trim() : "[No key details found]";
        }


        public async Task<IEnumerable<HomeDocumentsDto>> GetDocumentsByHomeIdAsync(int homeId)
        {
            var docs = await _repo.GetDocumentsByHomeIdAsync(homeId);
            return _mapper.Map<IEnumerable<HomeDocumentsDto>>(docs);
        }

        public async Task<IEnumerable<HomeDocumentsDto>> GetDocumentsByTypeAsync(int homeId, DocumentType type)
        {
            var docs = await _repo.GetDocumentsByTypeAsync(homeId, type);
            return _mapper.Map<IEnumerable<HomeDocumentsDto>>(docs);
        }

        public async Task DeleteDocumentAsync(int documentId)
        {
            await _repo.DeleteDocumentAsync(documentId);
        }

        public async Task<IEnumerable<HomeListDto>> FilterHomesAsync(bool? approved = null, bool? active = null, Guid? userId = null)
        {
            var homes = await _repo.FilterHomesAsync(approved, active, userId);
            return _mapper.Map<IEnumerable<HomeListDto>>(homes);
        }
        

    }
}