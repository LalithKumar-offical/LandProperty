using AutoMapper;
using LoanProperty.Manager.Implementation;
using LoanProperty.Manager.IService;
using LoanProperty.Manager.Mappers;
using LoanProperty.Repo.IRepo;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ILandApplication = LoanProperty.Manager.IService.ILandApplication;
using ILogger = LoanProperty.Manager.IService.ILogger;

namespace LoanProperty.Manager
{
    public static class DIBootStrapper
    {
        public static IServiceCollection AddServiceDependencies(this IServiceCollection services, IHostEnvironment env)
        {
            services.AddScoped<IUser, UserService>();
            services.AddScoped<IlandOwner, LandOwnerService>();
            services.AddScoped<IBids, BidsService>();
            services.AddScoped<IHomeApplication, HomeApplicationService>();
            services.AddScoped<ILandApplication, LandApplicationService>();
            services.AddScoped<IToken, TokenService>();
            services.AddScoped<IPassword, PasswordService>();

            services.AddAutoMapper(cfg => { }, typeof(MappingProfile));

            services.AddScoped<IHomeOwner>(provider =>
            {
                var repo = provider.GetRequiredService<IOwnerHomeDetails>();
                var mapper = provider.GetRequiredService<IMapper>();
                var tessDataPath = Path.Combine(env.ContentRootPath, "TessData");

                return new HomeOwnerService(repo, mapper, tessDataPath);
            });

            services.AddScoped<IEmail, EmailService>();
            services.AddScoped<ILogger, LoggerService>();

            return services;
        }
    }
}