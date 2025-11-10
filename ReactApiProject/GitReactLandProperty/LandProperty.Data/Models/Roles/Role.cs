using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
