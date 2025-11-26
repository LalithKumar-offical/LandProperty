using LandProperty.Data.Data;
using LandProperty.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Repo.Implementation
{
    public class LoggerRepo : IRepo.ILogger
    {
        private readonly LandPropertyContext _context;

        public LoggerRepo(LandPropertyContext context)
        {
            _context = context;
        }

        public async Task AddLogAsync(Logger log)
        {
            await _context.Loggers.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Logger>> GetAllLogsAsync()
        {
            return await _context.Loggers
                .FromSqlRaw("EXEC GetAllLogs")
                .ToListAsync();
        }

        public async Task DeleteAllLogsAsync()
        {
            var allLogs = await _context.Loggers.ToListAsync();
            _context.Loggers.RemoveRange(allLogs);
            await _context.SaveChangesAsync();
        }
    }
}