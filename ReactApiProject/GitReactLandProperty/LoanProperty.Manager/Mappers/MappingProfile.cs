using AutoMapper;
using LandProperty.Contract.DTO;
using LandProperty.Data.Models;
using LandProperty.Data.Models.Bids;
using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using static LandProperty.Contract.DTO.HomeDocumentsDTO;
using static LandProperty.Contract.DTO.LandDocumentsDTO;

namespace LoanProperty.Manager.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ========== USER ==========
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.RoleName,
                    opt => opt.MapFrom(src =>
                        src.Role != null ? src.Role.RoleTypeNo.ToString() : null));

            CreateMap<RegisterUserDto, User>();
            CreateMap<UserDto, User>();

            // ========== OWNER HOME ==========
            CreateMap<OwnerHomeDetails, HomeListDto>();
            CreateMap<OwnerHomeDetails, HomeDetailsDto>();
            CreateMap<CreateHomeDto, OwnerHomeDetails>();

            CreateMap<UpdateHomeDto, OwnerHomeDetails>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));

            // ========== OWNER LAND ==========
            CreateMap<OwnerLandDetails, LandListDto>();
            CreateMap<OwnerLandDetails, LandDetailsDto>();
            CreateMap<CreateLandDto, OwnerLandDetails>();

            // ========== BIDS ==========
            // Main mapping for returning bid data with names
            // ========== BIDS ==========
            CreateMap<Bid, BidResponseDto>()
     .ForMember(dest => dest.HomeName,
         opt => opt.MapFrom(src => src.Home != null ? src.Home.HomeName : null))
     .ForMember(dest => dest.LandName,
         opt => opt.MapFrom(src => src.Land != null ? src.Land.LandName : null))
     .ForMember(dest => dest.PropertyType,
         opt => opt.MapFrom(src => src.PropertyType))
     .ForMember(dest => dest.OwnerPhoneNo, opt => opt.MapFrom(src =>
         src.Home != null && src.Home.User != null
             ? src.Home.User.UserPhoneNo
             : (src.Land != null && src.Land.User != null
                 ? src.Land.User.UserPhoneNo
                 : null)
     ));

            CreateMap<CreateBidDto, Bid>();

            CreateMap<CreateBidDto, Bid>().ReverseMap();
            CreateMap<Bid, OwnerBidsDto>()
           .ForMember(dest => dest.BidderId,
               opt => opt.MapFrom(src => src.UserId))
           .ForMember(dest => dest.BidderName,
               opt => opt.MapFrom(src => src.User.UserName))

           // HOME DETAILS
           .ForMember(dest => dest.HomeName,
               opt => opt.MapFrom(src => src.Home != null ? src.Home.HomeName : null))
           .ForMember(dest => dest.HomeAddress,
               opt => opt.MapFrom(src => src.Home != null ? src.Home.HomeAddress : null))

           // LAND DETAILS
           .ForMember(dest => dest.LandName,
               opt => opt.MapFrom(src => src.Land != null ? src.Land.LandName : null))
           .ForMember(dest => dest.LandLocation,
               opt => opt.MapFrom(src => src.Land != null
                   ? $"{src.Land.LandAddress}, {src.Land.LandCity}, {src.Land.LandState}"
                   : null
                   ))

    // OWNER PHONE
    .ForMember(dest => dest.OwnerPhoneNo, opt => opt.MapFrom(
        src => src.Home != null
            ? src.Home.User.UserPhoneNo        
            : src.Land != null
                ? src.Land.User.UserPhoneNo    
                : null
               ));

            // ========== HOME APPLICATIONS ==========
            CreateMap<UserHomeApplication, UserHomeApplicationDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null ? src.User.UserName : null))
                .ForMember(dest => dest.HomeDescription,
                    opt => opt.MapFrom(src => src.Home != null ? src.Home.HomeDiscription : null));

            CreateMap<CreateUserHomeApplicationDto, UserHomeApplication>();

            // ========== LAND APPLICATIONS ==========
            CreateMap<UserLandApllication, UserLandApplicationDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null ? src.User.UserName : null))
                .ForMember(dest => dest.LandDescription,
                    opt => opt.MapFrom(src => src.Land != null ? src.Land.LandDescription : null));

            CreateMap<CreateUserLandApplicationDto, UserLandApllication>();

            // ========== LOGGER ==========
            CreateMap<Logger, LoggerDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src =>
                        src.User != null ? src.User.UserName : null));

            // ========== HOME DOCUMENTS ==========
            CreateMap<HomeDocuments, HomeDocumentsDto>()
                .ForMember(dest => dest.DocumentType,
                    opt => opt.MapFrom(src =>
                        src.DocumentType.HasValue ? src.DocumentType.ToString() : null));

            CreateMap<CreateHomeDocumentDto, HomeDocuments>()
                .ForMember(dest => dest.DocumentType, opt => opt.Ignore())
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) => srcMember != null));

            // ========== LAND DOCUMENTS ==========
            CreateMap<LandDocumnets, LandDocumentsDto>()
                .ForMember(dest => dest.DocumentType,
                    opt => opt.MapFrom(src =>
                        src.DocumentType.HasValue ? src.DocumentType.ToString() : null));

            CreateMap<CreateLandDocumentDto, LandDocumnets>()
                .ForMember(dest => dest.DocumentType, opt => opt.Ignore())
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) => srcMember != null));

            // ========== OWNER HOME WITH DOCUMENTS ==========
            CreateMap<OwnerHomeDetails, HomeWithOwnerAndDocumentsDto>()
                .ForMember(dest => dest.HomeName,
                    opt => opt.MapFrom(src => src.HomeName ?? string.Empty))
                .ForMember(dest => dest.HomeDescription,
                    opt => opt.MapFrom(src => src.HomeDiscription ?? string.Empty))
                .ForMember(dest => dest.HomeAddress,
                    opt => opt.MapFrom(src => src.HomeAddress ?? string.Empty))
                .ForMember(dest => dest.HomeCity,
                    opt => opt.MapFrom(src => src.HomeCity ?? string.Empty))
                .ForMember(dest => dest.HomeState,
                    opt => opt.MapFrom(src => src.HomeState ?? string.Empty))
                .ForMember(dest => dest.HomePincode,
                    opt => opt.MapFrom(src => src.HomePincode ?? string.Empty))
                .ForMember(dest => dest.HomePhoneno,
                    opt => opt.MapFrom(src => src.HomePhoneno ?? string.Empty))
                .ForMember(dest => dest.HomePriceInital,
                    opt => opt.MapFrom(src => src.HomePriceInital))
                .ForMember(dest => dest.IsActive,
                    opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.HomeStatusApproved,
                    opt => opt.MapFrom(src => src.HomeStatusApproved))
                .ForMember(dest => dest.OwnerId,
                    opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.OwnerName,
                    opt => opt.MapFrom(src => src.User != null ? src.User.UserName ?? string.Empty : string.Empty))
                .ForMember(dest => dest.OwnerEmail,
                    opt => opt.MapFrom(src => src.User != null ? src.User.UserEmail ?? string.Empty : string.Empty))
                .ForMember(dest => dest.OwnerPhoneNo,
                    opt => opt.MapFrom(src => src.User != null ? src.User.UserPhoneNo ?? string.Empty : string.Empty))
                .ForMember(dest => dest.Documents,
                    opt => opt.MapFrom(src => src.HomeDocuments ?? new List<HomeDocuments>()));
            CreateMap<OwnerLandDetails, LandWithOwnerAndDocumentsDto>()
    .ForMember(dest => dest.LandId, opt => opt.MapFrom(src => src.LandId))
    .ForMember(dest => dest.LandName, opt => opt.MapFrom(src => src.LandName ?? string.Empty))
    .ForMember(dest => dest.LandDescription, opt => opt.MapFrom(src => src.LandDescription ?? string.Empty))
    .ForMember(dest => dest.LandAddress, opt => opt.MapFrom(src => src.LandAddress ?? string.Empty))
    .ForMember(dest => dest.LandCity, opt => opt.MapFrom(src => src.LandCity ?? string.Empty))
    .ForMember(dest => dest.LandState, opt => opt.MapFrom(src => src.LandState ?? string.Empty))
    .ForMember(dest => dest.LandPincode, opt => opt.MapFrom(src => src.LandPincode ?? string.Empty))
    .ForMember(dest => dest.LandPhoneNo, opt => opt.MapFrom(src => src.LandPhoneno ?? string.Empty))
    .ForMember(dest => dest.LandPriceInitial, opt => opt.MapFrom(src => src.LandPriceInitial))
    .ForMember(dest => dest.LandStatusApproved, opt => opt.MapFrom(src => src.LandStatusApproved))
    .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.Status))

    // Owner fields
    .ForMember(dest => dest.OwnerId, opt => opt.MapFrom(src => src.UserId))
    .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.User != null ? src.User.UserName : string.Empty))
    .ForMember(dest => dest.OwnerEmail, opt => opt.MapFrom(src => src.User != null ? src.User.UserEmail : string.Empty))
    .ForMember(dest => dest.OwnerPhoneNo, opt => opt.MapFrom(src => src.User != null ? src.User.UserPhoneNo : string.Empty))

    // Correct Land Documents type
    .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.LandDocuments));
            CreateMap<LandDocumnets, LandDocumentsDto>()
                .ForMember(dest => dest.LandDocumentId,
                    opt => opt.MapFrom(src => src.LandDocumentId))
                .ForMember(dest => dest.DocumentType,
                    opt => opt.MapFrom(src =>
                        src.DocumentType.HasValue ? src.DocumentType.ToString() : null))
                .ForMember(dest => dest.DocumentPath,
                    opt => opt.MapFrom(src => src.DocumentPath))
                .ForMember(dest => dest.DocumentDetailsExtracted,
                    opt => opt.MapFrom(src => src.DocumentDetailsExtracted))
                .ForMember(dest => dest.LandId,
                    opt => opt.MapFrom(src => src.LandId));

        }
    }
}