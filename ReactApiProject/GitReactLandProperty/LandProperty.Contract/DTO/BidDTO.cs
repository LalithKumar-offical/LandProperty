using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Contract.DTO
{
    public class CreateBidDto
    {
        public Guid UserId { get; set; }
        public int? HomeId { get; set; }
        public int? LandId { get; set; }
        public decimal BidAmountByUser { get; set; }
        public PropertyType? PropertyType { get; set; } // enum as string
    }
    public class BidResponseDto
    {
        public int BidId { get; set; }
        public decimal BidAmountByUser { get; set; }
        public decimal BidAmountByOwner { get; set; }
        public bool PurchaseRequest { get; set; }
        public PropertyType? PropertyType { get; set; }    
    }

}
