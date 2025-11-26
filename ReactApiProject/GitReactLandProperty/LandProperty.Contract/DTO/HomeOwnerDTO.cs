using static LandProperty.Contract.DTO.HomeDocumentsDTO;

namespace LandProperty.Contract.DTO
{
    public class CreateHomeDto
    {
        public string? HomeDiscription { get; set; }
        public string? HomeName { get; set; }
        public string? HomeAddress { get; set; }
        public string? HomeCity { get; set; }
        public string? HomeState { get; set; }
        public string? HomePincode { get; set; }
        public decimal AreaInSqFt { get; set; }
        public decimal HomePriceInital { get; set; }
        public Guid UserId { get; set; }
    }

    public class HomeListDto
    {
        public int HomeId { get; set; }
        public string? HomeName { get; set; }
        public string? HomeDiscription { get; set; }
        public string? HomeCity { get; set; }
        public decimal HomePriceInital { get; set; }
        public bool HomeStatusApproved { get; set; }
        public string? RejectedReason { get; set; }
        public bool Status { get; set; }
    }

    public class HomeDetailsDto
    {
        public int HomeId { get; set; }
        public string? HomeName { get; set; }
        public string? HomeDiscription { get; set; }
        public string? HomeAddress { get; set; }
        public string? HomeCity { get; set; }
        public string? HomeState { get; set; }
        public decimal AreaInSqFt { get; set; }
        public decimal HomePriceInital { get; set; }
        public bool HomeStatusApproved { get; set; }
        public bool Status { get; set; }
        public string? RejectedReason { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public IEnumerable<HomeDocumentsDto>? HomeDocuments { get; set; }
    }

    public class UpdateHomeDto
    {
        public string? HomeName { get; set; }
        public int HomeId { get; set; }
        public string? HomeDiscription { get; set; }
        public string? HomeAddress { get; set; }
        public decimal HomePriceInital { get; set; }
        public bool Status { get; set; }
    }

    public class UpdateHomeStatus
    {
        public int HomeId { get; set; }
        public bool HomeStatusApproved { get; set; }
    }

    public class HomeWithOwnerAndDocumentsDto
    {
        public int HomeId { get; set; }

        public string? HomeName { get; set; }
        public string? HomeDescription { get; set; }
        public string? HomeAddress { get; set; }
        public string? HomeCity { get; set; }
        public string? HomeState { get; set; }
        public string? HomePincode { get; set; }
        public string? HomePhoneno { get; set; }
        public string? RejectedReason { get; set; }

        public decimal HomePriceInital { get; set; }

        public bool HomeStatusApproved { get; set; }

        public bool IsActive { get; set; }

        public Guid OwnerId { get; set; }

        public string? OwnerName { get; set; }
        public string? OwnerEmail { get; set; }
        public string? OwnerPhoneNo { get; set; }

        public List<HomeDocumentsDTO.HomeDocumentsDto> Documents { get; set; } = new();
    }
}