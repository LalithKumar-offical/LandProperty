using LandProperty.Data.Data;
using LandProperty.Data.Models.Bids;
using LoanProperty.Repo.Implementation;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.UnitTesting.Repo
{
    [TestFixture]
    public class BidsRepoTesting
    {
        private LandPropertyContext _context;
        private BidRepo _repo;

        private Guid _user1;
        private Guid _user2;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<LandPropertyContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // fresh DB for each test
                .Options;

            _context = new LandPropertyContext(options);
            _repo = new BidRepo(_context);

            // Seed sample users and bids
            _user1 = Guid.NewGuid();
            _user2 = Guid.NewGuid();

            _context.Bids.AddRange(
                new Bid { BidId = 1, UserId = _user1, HomeId = 5, BidAmountByUser = 10000, PurchaseRequest = false },
                new Bid { BidId = 2, UserId = _user2, LandId = 8, BidAmountByUser = 20000, PurchaseRequest = false }
            );
            _context.SaveChanges();
        }

        [TearDown]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        // ✅ 1. AddOrUpdateBidAsync - Adds a new bid
        [Test]
        public async Task AddOrUpdateBidAsync_ShouldAddNewBid_WhenNoExistingBid()
        {
            var newBid = new Bid
            {
                UserId = Guid.NewGuid(),
                HomeId = 10,
                BidAmountByUser = 15000
            };

            await _repo.AddOrUpdateBidAsync(newBid);

            Assert.That(_context.Bids.Count(), Is.EqualTo(3));
            Assert.That(_context.Bids.Any(b => b.HomeId == 10), Is.True);
        }

        // ✅ 2. AddOrUpdateBidAsync - Updates existing bid
        [Test]
        public async Task AddOrUpdateBidAsync_ShouldUpdateBid_WhenExistingBidFound()
        {
            var existing = _context.Bids.First(b => b.HomeId == 5);
            var updated = new Bid
            {
                UserId = existing.UserId,
                HomeId = existing.HomeId,
                BidAmountByUser = 55555
            };

            await _repo.AddOrUpdateBidAsync(updated);

            var result = _context.Bids.First(b => b.HomeId == 5);
            Assert.That(result.BidAmountByUser, Is.EqualTo(55555));
        }

        // ✅ 3. UpdateBidAsync
        [Test]
        public async Task UpdateBidAsync_ShouldUpdateBidAmountByOwner()
        {
            var existing = _context.Bids.First();
            existing.BidAmountByOwner = 99999;
            existing.PurchaseRequest = true;

            await _repo.UpdateBidAsync(existing);

            var result = await _context.Bids.FindAsync(existing.BidId);
            Assert.That(result.BidAmountByOwner, Is.EqualTo(99999));
            Assert.That(result.PurchaseRequest, Is.True);
        }

        // ✅ 4. GetBidByIdAsync
        [Test]
        public async Task GetBidByIdAsync_ShouldReturnCorrectBid()
        {
            var bid = await _repo.GetBidByIdAsync(1);

            Assert.That(bid, Is.Not.Null);
            Assert.That(bid.BidId, Is.EqualTo(1));
        }

        // ✅ 5. GetBidsByUserAsync
        [Test]
        public async Task GetBidsByUserAsync_ShouldReturnAllBidsForUser()
        {
            var result = await _repo.GetBidsByUserAsync(_user1);

            Assert.That(result.Count(), Is.EqualTo(1));
            Assert.That(result.First().UserId, Is.EqualTo(_user1));
        }

        // ✅ 6. GetBidsByPropertyAsync (Home)
        [Test]
        public async Task GetBidsByPropertyAsync_ShouldReturnBids_WhenHomeIdProvided()
        {
            var result = await _repo.GetBidsByPropertyAsync(homeId: 5);

            Assert.That(result.Count(), Is.EqualTo(1));
            Assert.That(result.First().HomeId, Is.EqualTo(5));
        }

        // ✅ 7. GetBidsByPropertyAsync (Land)
        [Test]
        public async Task GetBidsByPropertyAsync_ShouldReturnBids_WhenLandIdProvided()
        {
            var result = await _repo.GetBidsByPropertyAsync(landId: 8);

            Assert.That(result.Count(), Is.EqualTo(1));
            Assert.That(result.First().LandId, Is.EqualTo(8));
        }
    }
}
