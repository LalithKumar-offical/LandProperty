using LandProperty.Data.Models;

namespace LoanProperty.Repo.IRepo
{
    public interface IHomeApplicaton
    {
        Task AddApplicationAsync(UserHomeApplication application);

        Task<UserHomeApplication?> GetApplicationByIdAsync(int applicationId);

        Task<IEnumerable<UserHomeApplication>> GetApplicationsByUserAsync(Guid userId);

        Task<IEnumerable<UserHomeApplication>> GetApplicationsByHomeAsync(int homeId);

        Task<IEnumerable<UserHomeApplication>> GetAllApplicationsAsync();
    }
}