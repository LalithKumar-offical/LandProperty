using LandProperty.Contract.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Manager.IService
{
    public interface IBids
    {
        Task<BidResponseDto?> GetBidByIdAsync(int bidId);
        Task<IEnumerable<BidResponseDto>> GetBidsByUserAsync(Guid userId);
        Task<IEnumerable<BidResponseDto>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null);
        Task AddBidAsync(CreateBidDto dto);
        Task UpdateBidAsync(BidResponseDto dto);
    }
}
