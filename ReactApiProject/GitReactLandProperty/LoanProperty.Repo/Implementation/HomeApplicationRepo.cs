using LandProperty.Data.Data;
using LandProperty.Data.Models;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.Implementation
{
    internal class HomeApplicationRepo : IHomeApplicaton
    {
        private readonly LandPropertyContext _context;

        public HomeApplicationRepo(LandPropertyContext context)
        {
            _context = context;
        }

        // 🔹 Create new application when user applies/purchases a home
        public async Task AddApplicationAsync(UserHomeApplication application)
        {
            await _context.UserHomeApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        // 🔹 Get application by ID
        public async Task<UserHomeApplication?> GetApplicationByIdAsync(int applicationId)
        {
            return await _context.UserHomeApplications
                .Include(a => a.User)
                .Include(a => a.Home)
                .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);
        }

        // 🔹 Get all applications by a specific user
        public async Task<IEnumerable<UserHomeApplication>> GetApplicationsByUserAsync(Guid userId)
        {
            return await _context.UserHomeApplications
                .Include(a => a.Home)
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        // 🔹 Get all applications for a specific home
        public async Task<IEnumerable<UserHomeApplication>> GetApplicationsByHomeAsync(int homeId)
        {
            return await _context.UserHomeApplications
                .Include(a => a.User)
                .Where(a => a.HomeId == homeId)
                .ToListAsync();
        }

        // 🔹 Get all applications (for admin view/report)
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
