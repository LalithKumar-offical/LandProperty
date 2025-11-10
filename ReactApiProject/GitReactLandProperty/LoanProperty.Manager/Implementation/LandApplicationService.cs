using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.Implementation;
using LoanProperty.Repo.IRepo;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanProperty.Manager.Implementation
{
    public class LandApplicationService : IService.ILandApplication
    {
        private readonly LoanProperty.Repo.IRepo.ILandApplication _repo;
        private readonly IMapper _mapper;

        public LandApplicationService(LoanProperty.Repo.IRepo.ILandApplication repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // 🔹 Add new land application
        public async Task AddApplicationAsync(CreateUserLandApplicationDto dto)
        {
            var entity = _mapper.Map<UserLandApllication>(dto);
            await _repo.AddApplicationAsync(entity);
        }

        // 🔹 Get application by ID
        public async Task<UserLandApplicationDto?> GetApplicationByIdAsync(int applicationId)
        {
            var entity = await _repo.GetApplicationByIdAsync(applicationId);
            return _mapper.Map<UserLandApplicationDto>(entity);
        }

        // 🔹 Get all applications by user
        public async Task<IEnumerable<UserLandApplicationDto>> GetApplicationsByUserAsync(Guid userId)
        {
            var apps = await _repo.GetApplicationsByUserAsync(userId);
            return _mapper.Map<IEnumerable<UserLandApplicationDto>>(apps);
        }

        // 🔹 Get all applications by land
        public async Task<IEnumerable<UserLandApplicationDto>> GetApplicationsByLandAsync(int landId)
        {
            var apps = await _repo.GetApplicationsByLandAsync(landId);
            return _mapper.Map<IEnumerable<UserLandApplicationDto>>(apps);
        }

        // 🔹 Get all applications (for admin)
        public async Task<IEnumerable<UserLandApplicationDto>> GetAllApplicationsAsync()
        {
            var apps = await _repo.GetAllApplicationsAsync();
            return _mapper.Map<IEnumerable<UserLandApplicationDto>>(apps);
        }
    }
}
