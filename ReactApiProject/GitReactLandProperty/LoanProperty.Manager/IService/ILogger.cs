using LandProperty.Contract.DTO;

namespace LoanProperty.Manager.IService
{
    public interface ILogger
    {
        Task<IEnumerable<LoggerDto>> GetAllLogsAsync();
        Task DeleteAllLogsAsync();

        Task LogBidActionAsync(Guid userId, string action, int entityId, string description);
    }
}