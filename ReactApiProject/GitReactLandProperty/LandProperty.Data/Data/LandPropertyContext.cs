using LandProperty.Data.Models;
using LandProperty.Data.Models.Bids;
using LandProperty.Data.Models.OwnerHome;
using LandProperty.Data.Models.OwnerLand;
using LandProperty.Data.Models.Roles;
using Microsoft.EntityFrameworkCore;

namespace LandProperty.Data.Data
{
    public class LandPropertyContext : DbContext
    {
        public LandPropertyContext(DbContextOptions<LandPropertyContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<OwnerHomeDetails> OwnerHomeDetails { get; set; }
        public DbSet<HomeDocuments> HomeDocuments { get; set; }
        public DbSet<OwnerLandDetails> OwnerLandDetails { get; set; }
        public DbSet<LandDocumnets> LandDocuments { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<Logger> Loggers { get; set; }
        public DbSet<UserHomeApplication> UserHomeApplications { get; set; }
        public DbSet<UserLandApllication> UserLandApplications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== USER =====
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .Property(u => u.UserBalance)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserEmail)
                .IsUnique();

            // ===== ROLE =====
            modelBuilder.Entity<Role>()
                .Property(r => r.RoleTypeNo)
                .HasConversion<string>();

            // ===== OWNER HOME DETAILS =====
            modelBuilder.Entity<OwnerHomeDetails>()
                .HasOne(h => h.User)
                .WithMany(u => u.OwnerHomeDetails)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OwnerHomeDetails>()
                .Property(h => h.AreaInSqFt)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<OwnerHomeDetails>()
                .Property(h => h.HomePriceInital)
                .HasColumnType("decimal(10,2)");

            // Home ↔ Documents (1-to-many)
            modelBuilder.Entity<HomeDocuments>()
                .HasOne(d => d.OwnerHomeDetails)
                .WithMany(h => h.HomeDocuments)
                .HasForeignKey(d => d.HomeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Home ↔ Bids (1-to-many)
            modelBuilder.Entity<OwnerHomeDetails>()
                .HasMany(h => h.Bids)
                .WithOne(b => b.Home)
                .HasForeignKey(b => b.HomeId)
                .OnDelete(DeleteBehavior.NoAction);

            // ===== OWNER LAND DETAILS =====
            modelBuilder.Entity<OwnerLandDetails>()
                .HasOne(l => l.User)
                .WithMany(u => u.OwnerLandDetails)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OwnerLandDetails>()
                .Property(l => l.LandAreaInSqFt)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<OwnerLandDetails>()
                .Property(l => l.LandPriceInitial)
                .HasColumnType("decimal(10,2)");

            // Land ↔ Documents (1-to-many)
            modelBuilder.Entity<LandDocumnets>()
                .HasOne(d => d.OwnerLandDetails)
                .WithMany(l => l.LandDocuments)
                .HasForeignKey(d => d.LandId)
                .OnDelete(DeleteBehavior.Cascade);

            // Land ↔ Bids (1-to-many)
            modelBuilder.Entity<OwnerLandDetails>()
                .HasMany(l => l.Bids)
                .WithOne(b => b.Land)
                .HasForeignKey(b => b.LandId)
                .OnDelete(DeleteBehavior.NoAction);

            // ===== BID =====
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bid)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bid>()
                .Property(b => b.BidAmountByUser)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Bid>()
                .Property(b => b.BidAmountByOwner)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Bid>()
                .Property(b => b.PropertyType)
                .HasConversion<string>();

            // ===== LOGGER =====
            modelBuilder.Entity<Logger>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===== USER HOME APPLICATION =====
            modelBuilder.Entity<UserHomeApplication>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserHomeApplication>()
                .HasOne(a => a.Home)
                .WithMany()
                .HasForeignKey(a => a.HomeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserHomeApplication>()
                .Property(a => a.OfferedAmount)
                .HasColumnType("decimal(18,2)");

            // ===== USER LAND APPLICATION =====
            modelBuilder.Entity<UserLandApllication>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserLandApllication>()
                .HasOne(a => a.Land)
                .WithMany()
                .HasForeignKey(a => a.LandId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLandApllication>()
                .Property(a => a.OfferedAmount)
                .HasColumnType("decimal(18,2)");
        }
    }
}