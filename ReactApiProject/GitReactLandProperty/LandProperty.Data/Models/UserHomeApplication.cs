using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Data.Models
{
    public class UserHomeApplication
    {
        [Key]
        public int ApplicationId { get; set; }

        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int HomeId { get; set; }
        [ForeignKey("HomeId")]
        public OwnerHomeDetails? Home { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OfferedAmount { get; set; }

        public ApplicationStatus? Status { get; set; } = ApplicationStatus.Pending;

        public DateTime? PurchasedDate { get; set; }=DateTime.UtcNow;
    }
}
