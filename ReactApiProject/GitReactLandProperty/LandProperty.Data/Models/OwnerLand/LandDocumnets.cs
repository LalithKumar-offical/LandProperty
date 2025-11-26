using LandProperty.Data.Models.Roles;
using System.ComponentModel.DataAnnotations;

namespace LandProperty.Data.Models.OwnerLand
{
    public class LandDocumnets
    {
        [Key]
        public int LandDocumentId { get; set; }

        public DocumentType? DocumentType { get; set; }

        [MaxLength(100)]
        public string? DocumentDetailsExtracted { get; set; }

        public string? DocumentPath { get; set; }
        public int? LandId { get; set; }
        public OwnerLandDetails? OwnerLandDetails { get; set; }
    }
}