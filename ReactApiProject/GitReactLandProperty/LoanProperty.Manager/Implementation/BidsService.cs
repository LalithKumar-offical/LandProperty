using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models.Bids;
using LandProperty.Data.Models.Roles;
using LoanProperty.Manager.IService;
using LoanProperty.Repo.IRepo;

namespace LoanProperty.Manager.Implementation
{
    public class BidsService : IBids
    {
        private readonly IBid _bidRepo;
        private readonly IMapper _mapper;
        private readonly IOwnerHomeDetails _homeRepo;
        private readonly IOwnerLandDetails _landRepo;
        private readonly IUser _userRepo;
        private readonly IEmail _emailService;
        private readonly IService.ILogger _loggerService; 
        public BidsService(
            IBid bidRepo,
            IMapper mapper,
            IOwnerHomeDetails homeRepo,
            IOwnerLandDetails landRepo,
            IUser userRepo,
            IEmail emailService,
            IService.ILogger loggerService) 
        {
            _bidRepo = bidRepo;
            _mapper = mapper;
            _homeRepo = homeRepo;
            _landRepo = landRepo;
            _userRepo = userRepo;
            _emailService = emailService;
            _loggerService = loggerService;
        }

        public async Task AddBidAsync(CreateBidDto dto)
        {
            if (dto.PropertyType == PropertyType.Home && dto.HomeId.HasValue)
            {
                var home = await _homeRepo.GetHomeByIdAsync(dto.HomeId.Value);
                if (home == null)
                    throw new InvalidOperationException("Home not found.");
                if (home.UserId == dto.UserId)
                    throw new InvalidOperationException("You cannot bid on your own home.");
            }
            else if (dto.PropertyType == PropertyType.Land && dto.LandId.HasValue)
            {
                var land = await _landRepo.GetLandByIdAsync(dto.LandId.Value);
                if (land == null)
                    throw new InvalidOperationException("Land not found.");
                if (land.UserId == dto.UserId)
                    throw new InvalidOperationException("You cannot bid on your own land.");
            }
            else
            {
                throw new InvalidOperationException("Invalid property type or missing property ID.");
            }

            var bid = _mapper.Map<Bid>(dto);
            bid.PurchaseRequest = false;

            await _bidRepo.AddOrUpdateBidAsync(bid);

            await _loggerService.LogBidActionAsync(
                dto.UserId,
                "AddOrUpdateBid",
                bid.BidId,
                $"User {dto.UserId} placed or updated a bid of {bid.BidAmountByUser:C} for {dto.PropertyType} ID {(dto.PropertyType == PropertyType.Home ? dto.HomeId : dto.LandId)}"
            );
        }

        public async Task UpdateBidAsync(BidResponseDto dto)
        {
            var existingBid = await _bidRepo.GetBidByIdAsync(dto.BidId);
            if (existingBid == null)
                throw new InvalidOperationException("Bid not found.");

            existingBid.BidAmountByOwner = dto.BidAmountByOwner;
            existingBid.PurchaseRequest = dto.PurchaseRequest;
            await _bidRepo.UpdateBidAsync(existingBid);

            await _loggerService.LogBidActionAsync(
                existingBid.UserId,
                dto.PurchaseRequest ? "ApproveBid" : "CounterBid",
                existingBid.BidId,
                dto.PurchaseRequest
                    ? $"Owner approved bid #{existingBid.BidId} for {dto.PropertyType}"
                    : $"Owner made a counter offer of {existingBid.BidAmountByOwner:C} for {dto.PropertyType}"
            );

            var user = await _userRepo.GetUserByIdAsync(existingBid.UserId);
            if (user == null)
                throw new InvalidOperationException("User not found for this bid.");

            string subject = dto.PurchaseRequest
                ? "Your Bid Has Been Approved!"
                : "Owner Has Responded to Your Bid";

            string body = dto.PurchaseRequest
                ? $"<h3>Congratulations!</h3><p>Your bid for <strong>{dto.PropertyType}</strong> has been approved by the owner.</p>" +
                  $"<p>Final price agreed: <strong>{dto.BidAmountByOwner:C}</strong></p>"
                : $"<h3>Bid Update</h3><p>The property owner has updated your bid for <strong>{dto.PropertyType}</strong>.</p>" +
                  $"<p>New counter offer: <strong>{dto.BidAmountByOwner:C}</strong></p>";

            if (!string.IsNullOrWhiteSpace(user.UserEmail))
            {
                try
                {
                    await _emailService.SendEmailAsync(user.UserEmail, subject, body);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Email Warning] Could not send email to {user.UserEmail}: {ex.Message}");
                }
            }
            else
            {
                Console.WriteLine($"⚠️ Skipped email — User '{user.UserName}' has no registered email address.");
            }
        }

        public async Task<BidResponseDto?> GetBidByIdAsync(int bidId)
        {
            var bid = await _bidRepo.GetBidByIdAsync(bidId);

            return _mapper.Map<BidResponseDto>(bid);
        }

        public async Task<IEnumerable<BidResponseDto>> GetBidsByUserAsync(Guid userId)
        {
            var bids = await _bidRepo.GetBidsByUserAsync(userId);
            return _mapper.Map<IEnumerable<BidResponseDto>>(bids);
        }


        public async Task<IEnumerable<BidResponseDto>> GetBidsByPropertyAsync(int? homeId = null, int? landId = null)
        {
            var bids = await _bidRepo.GetBidsByPropertyAsync(homeId, landId);
            return _mapper.Map<IEnumerable<BidResponseDto>>(bids);
        }
        public async Task<IEnumerable<OwnerBidsDto>> GetBidsByOwnerAsync(Guid ownerId)
        {
            var bids = await _bidRepo.GetBidsByOwnerAsync(ownerId);
            return _mapper.Map<IEnumerable<OwnerBidsDto>>(bids);
        }
    }
}