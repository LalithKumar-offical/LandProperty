using LandProperty.Data.Models.Bids;
using LandProperty.Data.Models.Roles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LandProperty.Data.Models.OwnerHome
{
    public class OwnerHomeDetails
    {
        [Key]
        public int HomeId { get; set; }

        [MaxLength(50)]
        public string? HomeName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string? HomeDiscription { get; set; }

        [MaxLength(50)]
        public string? HomeAddress { get; set; }

        [MaxLength(20)]
        public string? HomeCity { get; set; }

        [MaxLength(20)]
        public string? HomeState { get; set; }

        [Required(ErrorMessage = "PIN code is required")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "PIN Code must be 6 digits")]
        public string? HomePincode { get; set; }

        [Required(ErrorMessage = "Area size is required")]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0.1, 99999.99, ErrorMessage = "Area must be valid")]
        public decimal AreaInSqFt { get; set; }

        [RegularExpression(@"^[6-9][0-9]*$", ErrorMessage = "Only numbers are allowed.")]
        [StringLength(10, ErrorMessage = "Maximum 10 digits allowed.")]
        public string? HomePhoneno { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal HomePriceInital { get; set; }

        public DateTime HomeSellDate { get; set; } = DateTime.UtcNow;
        public bool Status { get; set; } // active or inactive after purchase of home
        public bool HomeStatusApproved { get; set; } = false; // admin side approval or rejection of property

        [StringLength(100, MinimumLength = 3)]
        public string? RejectedReason { get; set; }

        public ICollection<HomeDocuments>? HomeDocuments { get; set; } // collection of Home Documents

        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<Bid>? Bids { get; set; }
    }
}