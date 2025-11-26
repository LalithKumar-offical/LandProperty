using System.ComponentModel.DataAnnotations;

namespace LandProperty.Data.Models.Roles
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        public RoleTypes? RoleTypeNo { get; set; } = RoleTypes.User;    
        public ICollection<User>? Users { get; set; }
    }
}