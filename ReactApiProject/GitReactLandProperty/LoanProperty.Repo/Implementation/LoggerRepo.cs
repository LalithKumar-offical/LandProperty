using LandProperty.Data.Data;
using LandProperty.Data.Models;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;
using Splat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.Implementation
{
    public class LoggerRepo:IRepo.ILogger
    {
        private readonly LandPropertyContext _context;

        public LoggerRepo(LandPropertyContext context)
        {
            _context = context;
        }

        // ==================== ADD LOG ====================
        public async Task AddLogAsync(Logger log)
        {
            await _context.Loggers.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        // ==================== GET ALL LOGS ====================
        public async Task<IEnumerable<Logger>> GetAllLogsAsync()
        {
            return await _context.Loggers
                .OrderByDescending(l => l.ActionDate)
                .ToListAsync();
        }

        // ==================== DELETE ALL LOGS ====================
        public async Task DeleteAllLogsAsync()
        {
            var allLogs = await _context.Loggers.ToListAsync();
            _context.Loggers.RemoveRange(allLogs);
            await _context.SaveChangesAsync();
        }
    }
}
