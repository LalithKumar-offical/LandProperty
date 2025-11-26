using LandProperty.Data.Data;
using LandProperty.Data.Models.Roles;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Repo.Implementation
{
    public class UserRepo : IGenericRepository<User, Guid>
    {
        private readonly LandPropertyContext _context;
        private readonly DbSet<User> _dbSet;

        public UserRepo(LandPropertyContext context)
        {
            _context = context;
            _dbSet = _context.Set<User>();
        }

        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<User> AddSynce(User entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<User> UpdateSynce(User entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();  
            return entity;
        }

        public async Task<IEnumerable<User>> GetAllSynce()
        {
            var users = await _context.Users
    .Include(u => u.Role)
    .ToListAsync();
            return users;
        }

        public async Task<User> GetById(Guid id)
        {
            var entity = await _dbSet.FindAsync(id);

            if (entity == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");
            return entity;
        }

        public async Task<User> DeleteSynce(User entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> FilterByDate(DateTime? date)
        {
            if (date == null)
                return await _dbSet.ToListAsync();

            var dateOnly = date.Value.Date;
            return await _dbSet
                .Where(u => EF.Property<DateTime>(u, "CreatedDate").Date == dateOnly)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> FilterByData(Guid userId)
        {
            return await _dbSet.Where(u => u.UserId == userId).ToListAsync();
        }

        public async Task<IEnumerable<User>> FilterByName(string Name) 
        {
            return await _dbSet.Where(u => u.UserName == Name).ToListAsync();
        }

        public async Task<IEnumerable<User>> FilterByApproval(bool Approved)
        {
            throw new NotImplementedException();
        }
    }
}