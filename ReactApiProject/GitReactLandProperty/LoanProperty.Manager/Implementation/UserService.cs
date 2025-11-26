using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Manager.Implementation
{
    public class UserService : IUser
    {
        private readonly IGenericRepository<User, Guid> _userRepo;
        private readonly IMapper _mapper;

        public UserService(IGenericRepository<User, Guid> userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepo.GetAllSynce();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepo.GetById(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> AddUserAsync(RegisterUserDto dto)
        {
            var user = _mapper.Map<User>(dto);

            user.UserPassword = BCrypt.Net.BCrypt.HashPassword(dto.UserPassword);

            var addedUser = await _userRepo.AddSynce(user);
            return _mapper.Map<UserDto>(addedUser);
        }

        public async Task<UserDto> UpdateUserAsync(UserDto dto)
        {
            var existing = await _userRepo.GetUserByIdAsync(dto.UserId);
            if (existing == null)
                throw new Exception("User not found");

            if (!string.IsNullOrWhiteSpace(dto.UserName))
                existing.UserName = dto.UserName;

            if (!string.IsNullOrWhiteSpace(dto.UserEmail))
                existing.UserEmail = dto.UserEmail;

            if (!string.IsNullOrWhiteSpace(dto.UserPhoneNo))
                existing.UserPhoneNo = dto.UserPhoneNo;

            if (dto.UserBalance.HasValue)
                existing.UserBalance = dto.UserBalance.Value;

            await _userRepo.SaveChangesAsync();

            return _mapper.Map<UserDto>(existing);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _userRepo.GetById(id);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            try
            {
                await _userRepo.DeleteSynce(user);
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("User has related data and cannot be deleted.");
            }
        }

        public async Task<IEnumerable<UserDto>> FilterUsersByDateAsync(DateTime? date)
        {
            var users = await _userRepo.FilterByDate(date);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<IEnumerable<UserDto>> FilterUsersByNameAsync(string name)
        {
            var users = await _userRepo.FilterByName(name);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<bool> VerifyPasswordAsync(Guid userId, string plainPassword)
        {
            var user = await _userRepo.GetById(userId);
            return user != null && BCrypt.Net.BCrypt.Verify(plainPassword, user.UserPassword);
        }
    }
}