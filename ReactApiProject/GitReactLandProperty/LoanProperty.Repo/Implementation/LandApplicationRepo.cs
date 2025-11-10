using LandProperty.Data.Data;
using LandProperty.Data.Models;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;


namespace LoanProperty.Repo.Implementation
{
    public class LandApplicationRepo:ILandApplication
    {
        private readonly LandPropertyContext _context;

        public LandApplicationRepo(LandPropertyContext context)
        {
            _context = context;
        }

        // 🔹 Create new application when user purchases/applies for land
        public async Task AddApplicationAsync(UserLandApllication application)
        {
            await _context.UserLandApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        // 🔹 Get application by ID
        public async Task<UserLandApllication?> GetApplicationByIdAsync(int applicationId)
        {
            return await _context.UserLandApplications
                .Include(a => a.User)
                .Include(a => a.Land)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);
        }

        // 🔹 Get all applications by user
        public async Task<IEnumerable<UserLandApllication>> GetApplicationsByUserAsync(Guid userId)
        {
            return await _context.UserLandApplications
                .Include(a => a.Land)
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        // 🔹 Get all applications for a specific land
        public async Task<IEnumerable<UserLandApllication>> GetApplicationsByLandAsync(int landId)
        {
            return await _context.UserLandApplications
                .Include(a => a.User)
                .Where(a => a.LandId == landId)
                .ToListAsync();
        }

        // 🔹 Get all applications (for admin view/report)
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
