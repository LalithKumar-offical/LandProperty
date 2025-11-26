using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo;
using Microsoft.AspNetCore.Http;
using static LandProperty.Contract.DTO.LandDocumentsDTO;

namespace LoanProperty.Manager.Implementation
{
    public class LandOwnerService : IlandOwner
    {
        private readonly IOwnerLandDetails _repo;
        private readonly IMapper _mapper;

        public LandOwnerService(IOwnerLandDetails repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        public async Task<IEnumerable<LandListDto>> GetAllLandsAsync()
        {
            var lands = await _repo.GetAllLandsAsync();
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }

        public async Task<LandDetailsDto?> GetLandByIdAsync(int landId)
        {
            var land = await _repo.GetLandByIdAsync(landId);
            return _mapper.Map<LandDetailsDto>(land);
        }

        public async Task<IEnumerable<LandListDto>> GetLandsByUserAsync(Guid userId)
        {
            var lands = await _repo.GetLandsByUserAsync(userId);
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }

        public async Task AddLandAsync(CreateLandDto dto)
        {
            var entity = _mapper.Map<OwnerLandDetails>(dto);
            await _repo.AddLandAsync(entity);
        }

        public async Task UpdateLandAsync(UpdateLandDto dto)
        {
            var entity = _mapper.Map<OwnerLandDetails>(dto);
            await _repo.UpdateLandAsync(entity);
        }

        public async Task DeleteLandAsync(int landId)
        {
            await _repo.DeleteLandAsync(landId);
        }


        public async Task<bool> ApproveLandAsync(int landId)
        {
            return await _repo.ApproveLandAsync(landId);
        }

        public async Task<bool> RejectLandAsync(int landId, string reason)
        {
            return await _repo.RejectLandAsync(landId, reason);
        }


        public async Task<LandDocumentsDto> UploadLandDocumentAsync(int landId, IFormFile file, DocumentType type)
        {
            var saved = await _repo.SaveFileAsync(landId, file, type, null); // no OCR text
            return _mapper.Map<LandDocumentsDto>(saved);
        }


        public async Task<IEnumerable<LandDocumentsDto>> GetDocumentsByLandIdAsync(int landId)
        {
            var docs = await _repo.GetDocumentsByLandIdAsync(landId);
            return _mapper.Map<IEnumerable<LandDocumentsDto>>(docs);
        }

        public async Task<IEnumerable<LandDocumentsDto>> GetDocumentsByTypeAsync(int landId, DocumentType type)
        {
            var docs = await _repo.GetDocumentsByTypeAsync(landId, type);
            return _mapper.Map<IEnumerable<LandDocumentsDto>>(docs);
        }

        public async Task DeleteDocumentAsync(int documentId)
        {
            await _repo.DeleteDocumentAsync(documentId);
        }


        public async Task<IEnumerable<LandListDto>> GetApprovedLandsAsync()
        {
            var lands = await _repo.GetApprovedLandsAsync();
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }

        public async Task<IEnumerable<LandListDto>> GetRejectedLandsAsync()
        {
            var lands = await _repo.GetRejectedLandsAsync();
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }

        public async Task<IEnumerable<LandListDto>> GetPendingLandsAsync()
        {
            var lands = await _repo.GetPendingLandsAsync();
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }

        public async Task<IEnumerable<LandListDto>> GetActiveLandsAsync()
        {
            var lands = await _repo.GetActiveLandsAsync();
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }

        public async Task<IEnumerable<LandListDto>> FilterLandsAsync(bool? approved = null, bool? active = null, Guid? userId = null)
        {
            var lands = await _repo.FilterLandsAsync(approved, active, userId);
            return _mapper.Map<IEnumerable<LandListDto>>(lands);
        }
        public async Task<List<LandWithOwnerAndDocumentsDto>> GetLandsWithOwnerAndDocumentsAsync()
        {
            var lands = await _repo.GetLandsWithOwnerAndDocumentsAsync();
            return _mapper.Map<List<LandWithOwnerAndDocumentsDto>>(lands);
        }

    }
}