using LandProperty.Data.Models;

namespace LoanProperty.Repo.IRepo
{
    public interface ILogger
    {
        Task AddLogAsync(Logger log);

        Task<IEnumerable<Logger>> GetAllLogsAsync();

        Task DeleteAllLogsAsync();
    }
}