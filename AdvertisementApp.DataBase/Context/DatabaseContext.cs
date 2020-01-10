using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using AdvertisementApp.BusinessLogic.Models.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AdvertisementApp.DataBase.Context
{
    //A hirdetések és felhasználók tárolásáért felelős adatbázis kontextus
    public class DatabaseContext : IdentityDbContext<ApplicationUser>
    {
        private readonly string connection;

        public DatabaseContext(DatabaseSettings settings)
        {
            connection = settings.ConnectionString;
        }

        protected override void OnConfiguring
            (DbContextOptionsBuilder optionsBuilder) =>
                optionsBuilder.UseSqlServer(connection);

        //Adatbázis létrehozása
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ApplicationUser>().HasOne(u => u.Subscription).WithOne(s => s.User).HasForeignKey<Subscription>(s => s.UserId);
            builder.Entity<ApplicationUser>().ToTable("Users", "dbo");
            builder.Entity<Advertisement>().Property(a => a.Status).HasConversion<string>();
            builder.Entity<Advertisement>().Property(a => a.Priority).HasConversion<string>();
            builder.Entity<MetaDetail>().Property(d => d.Importance).HasConversion<string>();
            builder.Entity<MetaDetail>().Property(d => d.Type).HasConversion<string>();

            SeedData(builder);
        }

        //Táblák
        public DbSet<Advertisement> Advertisements { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Detail> Details { get; set; }
        public DbSet<MetaDetail> MetaDetails { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<SubscriptionModel> SubscriptionModels { get; set; }
        public DbSet<Category> Categories { get; set; }

        //Seed data
        private void SeedData(ModelBuilder builder)
        {
            //Kategóriák
            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "For Sale" },
                new Category { Id = 2, Name = "For Rent" });

            //Meta hirdetés részletek
            builder.Entity<MetaDetail>().HasData(
                new MetaDetail { Id = 1, Name = "Estate type", Type = MetaType.Enumeration, Importance = Importance.Extra, Domain = "Flat;House;Office;Land", Required = true },
                new MetaDetail { Id = 2, Name = "Number of rooms", Type = MetaType.Number, Importance = Importance.Extra, Domain = null, Required = true },
                new MetaDetail { Id = 3, Name = "Country", Type = MetaType.Text, Importance = Importance.Basic, Domain = null, Required = true },
                new MetaDetail { Id = 4, Name = "City", Type = MetaType.Text, Importance = Importance.Basic, Domain = null, Required = false });

            //Előfizetés modellek
            builder.Entity<SubscriptionModel>().HasData(
                new SubscriptionModel { Id = 1, Name = "Normal", DurationInDays = 30, Price = 0, NormalAdvertisementCount = 10, HighlightedAdvertisementCount = 0, FeaturedAdvertisementCount = 0 },
                new SubscriptionModel { Id = 2, Name = "Premium", DurationInDays = 30, Price = 100, NormalAdvertisementCount = 20, HighlightedAdvertisementCount = 5, FeaturedAdvertisementCount = 0 }
                );
        }
    }
}