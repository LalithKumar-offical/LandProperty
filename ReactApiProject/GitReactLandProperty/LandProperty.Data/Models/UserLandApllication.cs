using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LandProperty.Data.Models
{
    public class UserLandApllication
    {
        [Key]
        public int ApplicationId { get; set; }

        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int LandId { get; set; }

        [ForeignKey("LandId")]
        public OwnerLandDetails? Land { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OfferedAmount { get; set; }

        public ApplicationStatus? Status { get; set; } = ApplicationStatus.Pending;

        public DateTime? PurchasedDate { get; set; } = DateTime.UtcNow;
    }
}