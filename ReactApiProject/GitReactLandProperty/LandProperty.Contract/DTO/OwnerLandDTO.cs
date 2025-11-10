using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static LandProperty.Contract.DTO.LandDocumentsDTO;

namespace LandProperty.Contract.DTO
{
    public class CreateLandDto
    {
        public string? LandDescription { get; set; }
        public string? LandAddress { get; set; }
        public string? LandCity { get; set; }
        public string? LandState { get; set; }
        public string? LandPincode { get; set; }
        public decimal LandAreaInSqFt { get; set; }
        public decimal LandPriceInitial { get; set; }
        public Guid UserId { get; set; }
    }
    public class LandListDto
    {
        public int LandId { get; set; }
        public string? LandDescription { get; set; }
        public string? LandCity { get; set; }
        public decimal LandPriceInitial { get; set; }
        public bool LandStatusApproved { get; set; }
        public bool Status { get; set; }
    }
    public class LandDetailsDto
    {
        public int LandId { get; set; }
        public string? LandDescription { get; set; }
        public string? LandAddress { get; set; }
        public string? LandCity { get; set; }
        public string? LandState { get; set; }
        public decimal LandAreaInSqFt { get; set; }
        public decimal LandPriceInitial { get; set; }
        public bool LandStatusApproved { get; set; }
        public bool Status { get; set; }
        public string? RejectedReason { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public IEnumerable<LandDocumentsDto>? LandDocuments { get; set; }
    }
    public class UpdateLandDto
    {
        public int LandId { get; set; }                      // Existing Land ID to update
        public string? LandDescription { get; set; }         // Optional updated description
        public string? LandAddress { get; set; }             // Optional address change
        public decimal LandPriceInitial { get; set; }        // Price update (if needed)
        public bool Status { get; set; }                     // Active/inactive status after sale
    } 

}
