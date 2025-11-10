using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Data.Models.OwnerHome
{
    public class HomeDocuments
    {
        [Key]
        public int HomeDocumnetsId { get; set; }

        public DocumentType? DocumentType { get; set; }
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string? DocumentDetailsExtracted { get; set; }
     
        public string? DocumentPath { get; set; }
        public int? HomeId {  get; set; } // id store
        public OwnerHomeDetails? OwnerHomeDetails { get; set; } // navigation property 
        
    }
}
