using LandProperty.Data.Data;
using LandProperty.Data.Models.Roles;
using LoanProperty.Repo.Implementation;
using LoanProperty.Repo.IRepo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanProperty.Repo
{
    public static class DIBootStrapper
    {
        public static IServiceCollection AddRepositoryDependencies(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<LandPropertyContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IGenericRepository<User, Guid>, UserRepo>();
            services.AddScoped<IOwnerHomeDetails, OwnerHomeDetailsRepo>();
            services.AddScoped<IOwnerLandDetails, OwnerLandDetailsRepo>();
            services.AddScoped<IBid, BidRepo>();

            services.AddScoped<IHomeApplicaton, HomeApplicationRepo>();
            services.AddScoped<ILandApplication, LandApplicationRepo>();
            services.AddScoped<ILogger, LoggerRepo>();  
            return services;
        }

    }
}
