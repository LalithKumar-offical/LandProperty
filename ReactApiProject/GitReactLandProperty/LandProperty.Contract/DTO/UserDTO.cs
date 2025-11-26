namespace LandProperty.Contract.DTO
{
    public class UserDto
    {
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPhoneNo { get; set; }
        public decimal? UserBalance { get; set; }
        public string? RoleName { get; set; }
    }

    public class RegisterUserDto
    {
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPhoneNo { get; set; }
        public string? UserPassword { get; set; }
        public int RoleId { get; set; }
    }

    public class LoginDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}