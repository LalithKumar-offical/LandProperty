using LandProperty.Contract.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface ILogger
    {
        Task<IEnumerable<LoggerDto>> GetAllLogsAsync();
        Task DeleteAllLogsAsync();

        // For Bid-specific actions
        Task LogBidActionAsync(Guid userId, string action, int entityId, string description);
    }
}
