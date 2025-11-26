using static LandProperty.Contract.DTO.LandDocumentsDTO;

namespace LandProperty.Contract.DTO
{
    public class CreateLandDto
    {
        public string? LandDescription { get; set; }
        public string? LandName { get; set; }
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
        public string? LandName { get; set; }
        public int LandId { get; set; }
        public string? LandDescription { get; set; }
        public string? LandCity { get; set; }
        public decimal LandPriceInitial { get; set; }
        public bool LandStatusApproved { get; set; }
        public bool Status { get; set; }
    }

    public class LandDetailsDto
    {
        public string? LandName { get; set; }
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
    public class LandWithOwnerAndDocumentsDto
    {
        public int LandId { get; set; }

        public string? LandName { get; set; }
        public string? LandDescription { get; set; }
        public string? LandAddress { get; set; }
        public string? LandCity { get; set; }
        public string? LandState { get; set; }
        public string? LandPincode { get; set; }
        public string? LandPhoneNo { get; set; }

        public decimal LandPriceInitial { get; set; }

        public bool LandStatusApproved { get; set; }

        public bool IsActive { get; set; }

        public Guid OwnerId { get; set; }

        public string? OwnerName { get; set; }
        public string? OwnerEmail { get; set; }
        public string? OwnerPhoneNo { get; set; }

        public List<LandDocumentsDto> Documents { get; set; } = new();
    }

    public class UpdateLandDto
    {
        public string? LandName { get; set; }
        public int LandId { get; set; }                      
        public string? LandDescription { get; set; }        
        public string? LandAddress { get; set; }             
        public decimal LandPriceInitial { get; set; }       
        public bool Status { get; set; }                     
    }
}