using LandProperty.Data.Models;

namespace LoanProperty.Repo.IRepo
{
    public interface ILandApplication
    {
        Task AddApplicationAsync(UserLandApllication application);

        Task<UserLandApllication?> GetApplicationByIdAsync(int applicationId);

        Task<IEnumerable<UserLandApllication>> GetApplicationsByUserAsync(Guid userId);

        Task<IEnumerable<UserLandApllication>> GetApplicationsByLandAsync(int landId);

        Task<IEnumerable<UserLandApllication>> GetAllApplicationsAsync();
    }
}