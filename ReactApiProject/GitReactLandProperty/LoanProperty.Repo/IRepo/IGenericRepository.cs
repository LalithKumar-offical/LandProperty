using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.IRepo
{
    public interface IGenericRepository<T,K> where T : class
    {
        Task<T> AddSynce(T entity); 
        Task<T> UpdateSynce(T entity);
        Task<IEnumerable<T>> GetAllSynce();
        Task<T> DeleteSynce(T entity);
        Task<T> GetById(K Id);
        Task<int> SaveChangesAsync();
        Task<IEnumerable<T>> FilterByDate(DateTime? date);
        Task<IEnumerable<T>> FilterByData(K Data);  
        Task<IEnumerable<T>> FilterByName(string Name);
        Task<IEnumerable<T>> FilterByApproval(bool Approved);
        Task<User?> GetUserByIdAsync(Guid userId);
    }
}
