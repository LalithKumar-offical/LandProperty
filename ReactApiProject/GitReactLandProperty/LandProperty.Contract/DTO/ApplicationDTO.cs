using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Contract.DTO
{
    public class UserHomeApplicationDto
    {
        public int ApplicationId { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public int HomeId { get; set; }
        public string? HomeDescription { get; set; }
        public decimal OfferedAmount { get; set; }
        public string? Status { get; set; }
        public DateTime? PurchasedDate { get; set; }
    }

    public class CreateUserHomeApplicationDto
    {
        public Guid UserId { get; set; }
        public int HomeId { get; set; }
        public decimal OfferedAmount { get; set; }
    }
    public class UserLandApplicationDto
    {
        public int ApplicationId { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public int LandId { get; set; }
        public string? LandDescription { get; set; }
        public decimal OfferedAmount { get; set; }
        public string? Status { get; set; }
        public DateTime? PurchasedDate { get; set; }
    }

    public class CreateUserLandApplicationDto
    {
        public Guid UserId { get; set; }
        public int LandId { get; set; }
        public decimal OfferedAmount { get; set; }
    }

}
