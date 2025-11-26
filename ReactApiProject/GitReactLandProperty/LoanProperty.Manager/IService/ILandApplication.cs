using LandProperty.Contract.DTO;

namespace LoanProperty.Manager.IService
{
    public interface ILandApplication
    {
        Task AddApplicationAsync(CreateUserLandApplicationDto dto);

        Task<UserLandApplicationDto?> GetApplicationByIdAsync(int applicationId);

        Task<IEnumerable<UserLandApplicationDto>> GetApplicationsByUserAsync(Guid userId);

        Task<IEnumerable<UserLandApplicationDto>> GetApplicationsByLandAsync(int landId);

        Task<IEnumerable<UserLandApplicationDto>> GetAllApplicationsAsync();
    }
}