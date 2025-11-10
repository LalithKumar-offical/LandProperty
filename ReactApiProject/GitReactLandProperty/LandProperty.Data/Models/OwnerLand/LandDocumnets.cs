using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
