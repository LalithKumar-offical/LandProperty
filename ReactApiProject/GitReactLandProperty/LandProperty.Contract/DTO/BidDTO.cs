using LandProperty.Data.Models.Roles;
using Microsoft.EntityFrameworkCore;

namespace LandProperty.Contract.DTO
{
    public class CreateBidDto
    {
        public Guid UserId { get; set; }
        public int? HomeId { get; set; }
        public int? LandId { get; set; }
        public decimal BidAmountByUser { get; set; }
        public PropertyType? PropertyType { get; set; } 
    }

    public class BidResponseDto
    {
        public int BidId { get; set; }
        public decimal BidAmountByUser { get; set; }
        public decimal BidAmountByOwner { get; set; }
        public string? HomeName { get; set; }
        public string? LandName { get; set; }
        public string? OwnerPhoneNo { get; set; }
        public bool PurchaseRequest { get; set; }
        public PropertyType? PropertyType { get; set; }
    }

    [Keyless]
    public class BidWithNamesDto
    {
        public int BidId { get; set; }
        public decimal BidAmountByUser { get; set; }
        public decimal BidAmountByOwner { get; set; }
        public bool PurchaseRequest { get; set; }
        public string? HomeName { get; set; }
        public string? LandName { get; set; }
    }

    public class OwnerBidsDto
    {
        public int BidId { get; set; }
        public decimal BidAmountByUser { get; set; }
        public decimal BidAmountByOwner { get; set; }
        public bool PurchaseRequest { get; set; }
        public PropertyType PropertyType { get; set; }

        public Guid BidderId { get; set; }
        public string? BidderName { get; set; }

        public int? HomeId { get; set; }
        public string? HomeName { get; set; }
        public string? HomeAddress { get; set; }

        public int? LandId { get; set; }
        public string? LandName { get; set; }
        public string? LandLocation { get; set; }
        public string? OwnerPhoneNo { get; set; }
    }
}