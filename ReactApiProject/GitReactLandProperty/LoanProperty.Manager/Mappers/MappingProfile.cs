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
            CreateMap<Bid, BidResponseDto>().ReverseMap();
            CreateMap<CreateBidDto, Bid>().ReverseMap();


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

            // ✅ Completely ignore Enum mapping — do not parse anything here
            CreateMap<CreateHomeDocumentDto, HomeDocuments>()
                .ForMember(dest => dest.DocumentType, opt => opt.Ignore())
                .ForAllMembers(opt =>
    opt.Condition((src, dest, srcMember) => srcMember != null));



            // ========== LAND DOCUMENTS ==========
            CreateMap<LandDocumnets, LandDocumentsDto>()
                .ForMember(dest => dest.DocumentType,
                    opt => opt.MapFrom(src =>
                        src.DocumentType.HasValue ? src.DocumentType.ToString() : null));

            // ✅ Completely ignore Enum mapping — do not parse anything here
            CreateMap<CreateLandDocumentDto, LandDocumnets>()
                .ForMember(dest => dest.DocumentType, opt => opt.Ignore())
                .ForAllMembers(opt =>
    opt.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}
