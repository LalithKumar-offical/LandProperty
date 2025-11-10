using LandProperty.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.IRepo
{
    public interface ILandApplication
    {
        Task AddApplicationAsync(UserLandApllication application);

        // 🔹 Get specific application
        Task<UserLandApllication?> GetApplicationByIdAsync(int applicationId);

        // 🔹 Get all applications by a particular user
        Task<IEnumerable<UserLandApllication>> GetApplicationsByUserAsync(Guid userId);

        // 🔹 Get all applications for a specific land
        Task<IEnumerable<UserLandApllication>> GetApplicationsByLandAsync(int landId);

        // 🔹 View all applications (for admin/reporting)
        Task<IEnumerable<UserLandApllication>> GetAllApplicationsAsync();
    }
}
