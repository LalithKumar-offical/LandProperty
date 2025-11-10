using LandProperty.Contract.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface IUser
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(Guid id);
        Task<UserDto> AddUserAsync(RegisterUserDto dto);
        Task<UserDto> UpdateUserAsync(UserDto dto);
        Task DeleteUserAsync(Guid id);
        Task<IEnumerable<UserDto>> FilterUsersByDateAsync(DateTime? date);
        Task<IEnumerable<UserDto>> FilterUsersByNameAsync(string name);
    }
}
