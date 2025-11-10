using LandProperty.Data.Data;
using LandProperty.Data.Models.Bids;
using LoanProperty.Repo.IRepo;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            // Determine if user already has a bid for this property
            var existingBid = await _context.Bids.FirstOrDefaultAsync(b =>
                b.UserId == bid.UserId &&
                (
                    (b.HomeId != null && b.HomeId == bid.HomeId) ||
                    (b.LandId != null && b.LandId == bid.LandId)
                ));

            if (existingBid != null)
            {
                // Update existing bid instead of adding new
                existingBid.BidAmountByUser = bid.BidAmountByUser;
                existingBid.PurchaseRequest = false; // reset purchase
                _context.Bids.Update(existingBid);
            }
            else
            {
                // Create new bid
                bid.PurchaseRequest = false;
                _context.Bids.Add(bid);
            }

            await _context.SaveChangesAsync();
        }

        // 🔹 Owner negotiation or purchase confirmation
        public async Task UpdateBidAsync(Bid bid)
        {
            var existingBid = await _context.Bids.FirstOrDefaultAsync(b => b.BidId == bid.BidId);

            if (existingBid == null)
                throw new KeyNotFoundException("Bid not found.");

            // Owner counter offer or approval
            existingBid.BidAmountByOwner = bid.BidAmountByOwner;
            existingBid.PurchaseRequest = bid.PurchaseRequest;

            _context.Bids.Update(existingBid);
            await _context.SaveChangesAsync();
        }

        // 🔹 Get single bid
        public async Task<Bid?> GetBidByIdAsync(int bidId)
        {
            return await _context.Bids
                .Include(b => b.User)
                .Include(b => b.Home)
                .Include(b => b.Land)
                .FirstOrDefaultAsync(b => b.BidId == bidId);
        }

        // 🔹 Get all bids by user
        public async Task<IEnumerable<Bid>> GetBidsByUserAsync(Guid userId)
        {
            return await _context.Bids
                .Where(b => b.UserId == userId)
                .Include(b => b.Home)
                .Include(b => b.Land)
                .ToListAsync();
        }

        // 🔹 Get all bids for a property (Home or Land)
        public async Task<IEnumerable<Bid>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null)
        {
            var homeParam = new SqlParameter("@HomeId", homeId ?? (object)DBNull.Value);
            var landParam = new SqlParameter("@LandId", landId ?? (object)DBNull.Value);

            // Run stored procedure, switch to client-side evaluation, then materialize
            var bids = _context.Bids
                .FromSqlRaw("EXEC GetBidsByProperty @HomeId, @LandId", homeParam, landParam)
                .AsEnumerable() // client-side
                .ToList(); // synchronous list creation

            return bids;
        }


    }
}
