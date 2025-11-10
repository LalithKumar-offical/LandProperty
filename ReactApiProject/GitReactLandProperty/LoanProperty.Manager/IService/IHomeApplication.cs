using LandProperty.Contract.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface IHomeApplication
    {
        Task AddApplicationAsync(CreateUserHomeApplicationDto dto);
        Task<UserHomeApplicationDto?> GetApplicationByIdAsync(int applicationId);
        Task<IEnumerable<UserHomeApplicationDto>> GetApplicationsByUserAsync(Guid userId);
        Task<IEnumerable<UserHomeApplicationDto>> GetApplicationsByHomeAsync(int homeId);
        Task<IEnumerable<UserHomeApplicationDto>> GetAllApplicationsAsync();
    }
}
