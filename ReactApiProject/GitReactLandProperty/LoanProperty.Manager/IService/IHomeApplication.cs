using LandProperty.Contract.DTO;

namespace LoanProperty.Manager.IService
{
    public interface IHomeApplication
    {
        Task AddApplicationAsync(CreateUserHomeApplicationDto dto);

        Task<UserHomeApplicationDto?> GetApplicationByIdAsync(int applicationId);

        Task<IEnumerable<UserHomeApplicationDto>> GetApplicationsByUserAsync(Guid userId);

        Task<IEnumerable<UserHomeApplicationDto>> GetApplicationsByHomeAsync(int homeId);

        Task<IEnumerable<UserHomeApplicationDto>> GetAllApplicationsAsync();
    }
}