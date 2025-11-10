using LandProperty.Data.Models;
using Splat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.IRepo
{
    public interface ILogger
    {
        Task AddLogAsync(Logger log);
        Task<IEnumerable<Logger>> GetAllLogsAsync();
        Task DeleteAllLogsAsync();
    }
}
