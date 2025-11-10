using AutoMapper;
using BCrypt.Net;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo;

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

            // ✅ Hash the password before saving
            user.UserPassword = BCrypt.Net.BCrypt.HashPassword(dto.UserPassword);

            var addedUser = await _userRepo.AddSynce(user);
            return _mapper.Map<UserDto>(addedUser);
        }

        public async Task<UserDto> UpdateUserAsync(UserDto dto)
        {
            var entity = _mapper.Map<User>(dto);
            var updatedUser = await _userRepo.UpdateSynce(entity);
            return _mapper.Map<UserDto>(updatedUser);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _userRepo.GetById(id);
            if (user != null)
                await _userRepo.DeleteSynce(user);
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

        // ✅ Optional: Password verification method (for login)
        public async Task<bool> VerifyPasswordAsync(Guid userId, string plainPassword)
        {
            var user = await _userRepo.GetById(userId);
            return user != null && BCrypt.Net.BCrypt.Verify(plainPassword, user.UserPassword);
        }
    }
}
