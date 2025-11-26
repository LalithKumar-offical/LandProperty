using LandProperty.Contract.DTO;

namespace LoanProperty.Manager.IService
{
    public interface IBids
    {
        Task AddBidAsync(CreateBidDto dto);

        Task UpdateBidAsync(BidResponseDto dto);

        Task<BidResponseDto?> GetBidByIdAsync(int bidId);

        Task<IEnumerable<BidResponseDto>> GetBidsByUserAsync(Guid userId);

        Task<IEnumerable<BidResponseDto>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null);

        Task<IEnumerable<OwnerBidsDto>> GetBidsByOwnerAsync(Guid ownerId);
    }
}