using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Data.Models.Roles
{
    public enum RoleTypes
    {
        Admin,
        PropertyOwner,
        User
    }
    public enum DocumentType { 
        Vedio,
        Image,
        Documnet
    }
    public enum PropertyType { 
        Home,
        Land
    }
    public enum ApplicationStatus
    {
        Pending,
        Success
    }
}
