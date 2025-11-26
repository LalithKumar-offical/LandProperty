using LandProperty.Data.Data;
using LandProperty.Data.Models.Bids;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;

namespace LoanProperty.Repo.Implementation
{
    public class BidRepo : IBid
    {
        private readonly LandPropertyContext _context;

        public BidRepo(LandPropertyContext context)
        {
            _context = context;
        }

        public async Task AddOrUpdateBidAsync(Bid bid)
        {
            var existingBid = await _context.Bids.FirstOrDefaultAsync(b =>
                b.UserId == bid.UserId &&
                (
                    (b.HomeId != null && b.HomeId == bid.HomeId) ||
                    (b.LandId != null && b.LandId == bid.LandId)
                ));

            if (existingBid != null)
            {
                existingBid.BidAmountByUser = bid.BidAmountByUser;
                existingBid.PurchaseRequest = false;
                _context.Bids.Update(existingBid);
            }
            else
            {
                bid.PurchaseRequest = false;
                _context.Bids.Add(bid);
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateBidAsync(Bid bid)
        {
            var existingBid = await _context.Bids.FirstOrDefaultAsync(b => b.BidId == bid.BidId);

            if (existingBid == null)
                throw new KeyNotFoundException("Bid not found.");

            existingBid.BidAmountByOwner = bid.BidAmountByOwner;
            existingBid.PurchaseRequest = bid.PurchaseRequest;

            _context.Bids.Update(existingBid);
            await _context.SaveChangesAsync();
        }

        public async Task<Bid?> GetBidByIdAsync(int bidId)
        {
            var bid = await _context.Bids
                .Include(b => b.Home)
                    .ThenInclude(h => h.User)
                .Include(b => b.Land)
                    .ThenInclude(l => l.User)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.BidId == bidId);

            Console.WriteLine("====== DEBUG ======");
            Console.WriteLine("Home.User: " + (bid?.Home?.User == null ? "NULL" : "LOADED"));
            Console.WriteLine("Land.User: " + (bid?.Land?.User == null ? "NULL" : "LOADED"));
            Console.WriteLine("Home.User.Phone: " + bid?.Home?.User?.UserPhoneNo);
            Console.WriteLine("Land.User.Phone: " + bid?.Land?.User?.UserPhoneNo);
            Console.WriteLine("===================");

            return bid;
        }

        public async Task<IEnumerable<Bid>> GetBidsByUserAsync(Guid userId)
        {
            return await _context.Bids
                .Where(b => b.UserId == userId)
                .Include(b => b.Home)
                    .ThenInclude(h => h.User)  
                .Include(b => b.Land)
                    .ThenInclude(l => l.User)   
                .ToListAsync();
        }

        public async Task<IEnumerable<Bid>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null)
        {
            return await _context.Bids
                .Include(b => b.Home)
                .Include(b => b.Land)
                .Where(b =>
                    (homeId != null && b.HomeId == homeId) ||
                    (landId != null && b.LandId == landId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Bid>> GetBidsByOwnerAsync(Guid ownerId)
        {
            return await _context.Bids
    .Include(b => b.Home)
        .ThenInclude(h => h.User)   
    .Include(b => b.Land)
        .ThenInclude(l => l.User)  
    .Include(b => b.User)          
    .Where(b =>
        (b.Home != null && b.Home.UserId == ownerId) ||
        (b.Land != null && b.Land.UserId == ownerId)
    )
    .ToListAsync();
        }
    }
}