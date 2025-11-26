using LandProperty.Data.Models.Bids;

namespace LoanProperty.Repo.IRepo
{
    public interface IBid
    {
        Task AddOrUpdateBidAsync(Bid bid);

        Task UpdateBidAsync(Bid bid);

        Task<Bid?> GetBidByIdAsync(int bidId);

        Task<IEnumerable<Bid>> GetBidsByUserAsync(Guid userId);

        Task<IEnumerable<Bid>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null);

        Task<IEnumerable<Bid>> GetBidsByOwnerAsync(Guid ownerId);
    }
}