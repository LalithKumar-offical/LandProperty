using LandProperty.Data.Models.Bids;
using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Data.Models.OwnerLand
{
    public class OwnerLandDetails
    {
        [Key]
        public int LandId { get; set; }
        [MaxLength(50)]
        public string? LandName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string? LandDescription { get; set; }

        [MaxLength(50)]
        public string? LandAddress { get; set; }

        [MaxLength(20)]
        public string? LandCity { get; set; }

        [MaxLength(20)]
        public string? LandState { get; set; }
        public bool Status { get; set; } // active or inactive after purchase of home 
        public bool LandStatusApproved { get; set; } // admin side approval or rejection of property 
        [StringLength(100, MinimumLength = 3)]
        public string? RejectedReason { get; set; }

        [Required(ErrorMessage = "PIN code is required")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "PIN Code must be 6 digits")]
        public string? LandPincode { get; set; }

        [Required(ErrorMessage = "Area size is required")]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0.1, 999999.99, ErrorMessage = "Area must be valid")]
        public decimal LandAreaInSqFt { get; set; }

        [RegularExpression(@"^[0-9]+$", ErrorMessage = "Only numbers are allowed.")]
        [StringLength(10, ErrorMessage = "Maximum 10 digits allowed.")]
        public string? LandPhoneno { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal LandPriceInitial { get; set; }

        public DateTime LandSellDate { get; set; } = DateTime.UtcNow;
        public ICollection<LandDocumnets>? LandDocuments { get; set; }
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public ICollection<Bid>? Bids { get; set; }
    }
}
