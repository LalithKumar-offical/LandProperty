using LandProperty.Data.Models.Roles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LandProperty.Data.Models
{
    public class Logger
    {
        [Key]
        public int LogId { get; set; }

        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Action { get; set; }

        [MaxLength(50)]
        public string? EntityType { get; set; }

        public int? EntityId { get; set; }

        public DateTime ActionDate { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]
        public string? Description { get; set; }  // Optional detail like "Bid amount: 50000"
    }
}