using LandProperty.Data.Models.Bids;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo.IRepo
{
    public interface IBid
    {
        Task AddOrUpdateBidAsync(Bid bid);

        // Owner updates (negotiates or approves)
        Task UpdateBidAsync(Bid bid);

        // Get bids
        Task<Bid?> GetBidByIdAsync(int bidId);
        Task<IEnumerable<Bid>> GetBidsByUserAsync(Guid userId);
        Task<IEnumerable<Bid>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null);
    }
}
