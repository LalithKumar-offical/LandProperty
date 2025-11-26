using LandProperty.Data.Models.Bids;
using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.OwnerLand;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LandProperty.Data.Models.Roles
{
    public class User
    {
        [Key]
        public Guid UserId { get; set; }

        [StringLength(25, MinimumLength = 3)]
        [Required]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Name can contain only letters and spaces.")]
        public string? UserName { get; set; }

        [Required]
        [StringLength(25, MinimumLength = 3)]
        [EmailAddress(ErrorMessage = "Invalid format")]
        public string? UserEmail { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]+$", ErrorMessage = "Only numbers are allowed.")]
        [StringLength(10, ErrorMessage = "Maximum 10 digits allowed.")]
        public string? UserPhoneNo { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
          ErrorMessage = "Password must have at least 8 characters, including uppercase, lowercase, number, and special character.")]
        public string? UserPassword { get; set; } // confirm password

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, 99999999.99, ErrorMessage = "Balance must be positive and valid.")]
        public decimal UserBalance { get; set; }

        [ForeignKey("RoleId")]
        public Role? Role { get; set; } // navigation

        public int RoleId { get; set; } // to store the id for the role table
        public ICollection<OwnerHomeDetails>? OwnerHomeDetails { get; set; }

        public ICollection<OwnerLandDetails>? OwnerLandDetails { get; set; }
        public ICollection<Bid>? Bid { get; set; }
    }
}