using LandProperty.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.IRepo
{
    public interface IHomeApplicaton
    {
        // 🔹 Create new application when user buys/applies for a home
        Task AddApplicationAsync(UserHomeApplication application);

        // 🔹 Get specific application
        Task<UserHomeApplication?> GetApplicationByIdAsync(int applicationId);

        // 🔹 Get all applications by a particular user
        Task<IEnumerable<UserHomeApplication>> GetApplicationsByUserAsync(Guid userId);

        // 🔹 Get all applications for a specific home
        Task<IEnumerable<UserHomeApplication>> GetApplicationsByHomeAsync(int homeId);

        // 🔹 View all applications (for admin/reporting)
        Task<IEnumerable<UserHomeApplication>> GetAllApplicationsAsync();
    }
}
