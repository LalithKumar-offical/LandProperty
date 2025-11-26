using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models;

namespace LoanProperty.Manager.Implementation
{
    public class LoggerService : IService.ILogger
    {
        private readonly Repo.IRepo.ILogger _loggerRepo;
        private readonly IMapper _mapper;

        public LoggerService(Repo.IRepo.ILogger loggerRepo, IMapper mapper)
        {
            _loggerRepo = loggerRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LoggerDto>> GetAllLogsAsync()
        {
            var logs = await _loggerRepo.GetAllLogsAsync();
            return _mapper.Map<IEnumerable<LoggerDto>>(logs);
        }

        public async Task DeleteAllLogsAsync()
        {
            await _loggerRepo.DeleteAllLogsAsync();
        }

        public async Task LogActionAsync(Guid userId, string action, string entityType, int entityId, string description)
        {
            var log = new Logger
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Description = description,
                ActionDate = DateTime.UtcNow
            };

            await _loggerRepo.AddLogAsync(log);
        }

        public async Task LogBidActionAsync(Guid userId, string action, int bidId, string description)
        {
            await LogActionAsync(userId, action, "Bid", bidId, description);
        }
    }
}