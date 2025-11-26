using LandProperty.Data.Data;
using LandProperty.Data.Models;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Repo.Implementation
{
    public class LandApplicationRepo : ILandApplication
    {
        private readonly LandPropertyContext _context;

        public LandApplicationRepo(LandPropertyContext context)
        {
            _context = context;
        }

        public async Task AddApplicationAsync(UserLandApllication application)
        {
            await _context.UserLandApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        public async Task<UserLandApllication?> GetApplicationByIdAsync(int applicationId)
        {
            return await _context.UserLandApplications
                .Include(a => a.User)
                .Include(a => a.Land)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);
        }

        public async Task<IEnumerable<UserLandApllication>> GetApplicationsByUserAsync(Guid userId)
        {
            return await _context.UserLandApplications
                .Include(a => a.Land)
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserLandApllication>> GetApplicationsByLandAsync(int landId)
        {
            return await _context.UserLandApplications
                .Include(a => a.User)
                .Where(a => a.LandId == landId)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserLandApllication>> GetAllApplicationsAsync()
        {
            return await _context.UserLandApplications
                .Include(a => a.User)
                .Include(a => a.Land)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}