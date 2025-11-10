using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Data.Models.Bids
{
    public class Bid
    {
        [Key]
        public int BidId { get; set; }
        [Column(TypeName ="decimal(18,2)")]
        public decimal BidAmountByUser { get; set; }
        [Column(TypeName ="decimal(18,2)")]
        public decimal BidAmountByOwner { get; set; }
        public PropertyType? PropertyType { get; set; }

        public bool PurchaseRequest { get; set; }=false;

        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public int? HomeId { get; set; }
        [ForeignKey("HomeId")]
        public OwnerHomeDetails? Home { get; set; }
        public int? LandId { get; set; }
        [ForeignKey("LandId")]
        public OwnerLandDetails? Land { get; set; }

    }
}
