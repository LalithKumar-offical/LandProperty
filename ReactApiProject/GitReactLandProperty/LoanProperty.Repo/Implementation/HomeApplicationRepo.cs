using LandProperty.Data.Data;
using LandProperty.Data.Models;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Repo.Implementation
{
    internal class HomeApplicationRepo : IHomeApplicaton
    {
        private readonly LandPropertyContext _context;

        public HomeApplicationRepo(LandPropertyContext context)
        {
            _context = context;
        }

        public async Task AddApplicationAsync(UserHomeApplication application)
        {
            await _context.UserHomeApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        public async Task<UserHomeApplication?> GetApplicationByIdAsync(int applicationId)
        {
            return await _context.UserHomeApplications
                .Include(a => a.User)
                .Include(a => a.Home)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);
        }
        public async Task<IEnumerable<UserHomeApplication>> GetApplicationsByUserAsync(Guid userId)
        {
            return await _context.UserHomeApplications
                .Include(a => a.Home)
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserHomeApplication>> GetApplicationsByHomeAsync(int homeId)
        {
            return await _context.UserHomeApplications
                .Include(a => a.User)
                .Where(a => a.HomeId == homeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserHomeApplication>> GetAllApplicationsAsync()
        {
            return await _context.UserHomeApplications
                .Include(a => a.User)
                .Include(a => a.Home)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}