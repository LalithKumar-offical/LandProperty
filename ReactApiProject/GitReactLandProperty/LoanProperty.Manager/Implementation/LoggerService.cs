using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo; // ✅ this is critical
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanProperty.Manager.Implementation
{
    public class LoggerService : IService.ILogger// ✅ use your service interface
    {
        private readonly Repo.IRepo.ILogger _loggerRepo; // ✅ repo interface, not IService.ILogger
        private readonly IMapper _mapper;

        public LoggerService(Repo.IRepo.ILogger loggerRepo, IMapper mapper) // ✅ correct injection
        {
            _loggerRepo = loggerRepo;
            _mapper = mapper;
        }

        // ==================== VIEW & DELETE ====================
        public async Task<IEnumerable<LoggerDto>> GetAllLogsAsync()
        {
            var logs = await _loggerRepo.GetAllLogsAsync();
            return _mapper.Map<IEnumerable<LoggerDto>>(logs);
        }

        public async Task DeleteAllLogsAsync()
        {
            await _loggerRepo.DeleteAllLogsAsync();
        }

        // ==================== LOGGING FOR BIDS ====================
        public async Task LogBidActionAsync(Guid userId, string action, int entityId, string description)
        {
            var log = new Logger
            {
                UserId = userId,
                Action = action,
                EntityType = "Bid",
                EntityId = entityId,
                Description = description,
                ActionDate = DateTime.UtcNow
            };

            await _loggerRepo.AddLogAsync(log);
        }
    }
}
