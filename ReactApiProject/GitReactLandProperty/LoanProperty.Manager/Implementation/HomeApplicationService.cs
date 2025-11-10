using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo;

namespace LoanProperty.Manager.Implementation
{
    public class HomeApplicationService:IHomeApplication
    {
        private readonly IHomeApplicaton _repo;
        private readonly IMapper _mapper;

        public HomeApplicationService(IHomeApplicaton repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // 🔹 Add new home application
        public async Task AddApplicationAsync(CreateUserHomeApplicationDto dto)
        {
            var entity = _mapper.Map<UserHomeApplication>(dto);
            await _repo.AddApplicationAsync(entity);
        }

        // 🔹 Get by ID
        public async Task<UserHomeApplicationDto?> GetApplicationByIdAsync(int applicationId)
        {
            var entity = await _repo.GetApplicationByIdAsync(applicationId);
            return _mapper.Map<UserHomeApplicationDto>(entity);
        }

        // 🔹 Get all by User
        public async Task<IEnumerable<UserHomeApplicationDto>> GetApplicationsByUserAsync(Guid userId)
        {
            var apps = await _repo.GetApplicationsByUserAsync(userId);
            return _mapper.Map<IEnumerable<UserHomeApplicationDto>>(apps);
        }

        // 🔹 Get all by Home
        public async Task<IEnumerable<UserHomeApplicationDto>> GetApplicationsByHomeAsync(int homeId)
        {
            var apps = await _repo.GetApplicationsByHomeAsync(homeId);
            return _mapper.Map<IEnumerable<UserHomeApplicationDto>>(apps);
        }

        // 🔹 Get all (Admin)
        public async Task<IEnumerable<UserHomeApplicationDto>> GetAllApplicationsAsync()
        {
            var apps = await _repo.GetAllApplicationsAsync();
            return _mapper.Map<IEnumerable<UserHomeApplicationDto>>(apps);
        }
    }
}
