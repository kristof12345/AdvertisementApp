using AdvertisementApp.BusinessLogic.Models.Users;
using AdvertisementApp.BusinessLogic.Repositories;
using AdvertisementApp.BusinessLogic.Services;
using AdvertisementApp.DataBase;
using AdvertisementApp.DataBase.Context;
using AdvertisementApp.DataBase.Repositories;
using AdvertisementApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace AdvertisementApp.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            var settings = Configuration.GetSection(nameof(DatabaseSettings)).Get<DatabaseSettings>();
            /*var settings = new DatabaseSettings
            {
                ConnectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=AdvertisementDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"
            };*/

            using (var context = new DatabaseContext(settings))
            {
                context.Database.EnsureCreated();
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //DB Connection String betöltése
            services.Configure<DatabaseSettings>(Configuration.GetSection(nameof(DatabaseSettings)));
            services.AddSingleton(sp => sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);

            //AutoMapper inicializálása
            MapperInitializer.InitializeMapper();

            //Adatbázis hozzáadása
            services.AddDbContext<DatabaseContext>(ServiceLifetime.Transient);

            //Függőség injektálás
            //Repositoryk
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IAdvertisementRepository, AdvertisementRepository>();
            services.AddTransient<IFileRepository, FileRepository>();
            services.AddTransient<IMetaDetailRepository, MetaDetailRepository>();
            services.AddTransient<ISubscriptionRepository, SubscriptionRepository>();
            //Servicek
            services.AddTransient<UserService, UserService>();
            services.AddTransient<AdvertisementService, AdvertisementService>();
            services.AddTransient<SubscriptionService, SubscriptionService>();
            services.AddTransient<MetaDetailService, MetaDetailService>();
            services.AddTransient<ImageService, ImageService>();
            services.AddTransient<IPaymentService, DemoPaymentService>();

            //Identity hozzáadása
            services.AddIdentityCore<ApplicationUser>(options => { });
            new IdentityBuilder(typeof(ApplicationUser), typeof(IdentityRole), services)
                .AddRoleManager<RoleManager<IdentityRole>>()
                .AddSignInManager<SignInManager<ApplicationUser>>()
                .AddEntityFrameworkStores<DatabaseContext>();

            //Jelszó követelmény beállítások
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            });

            services.AddTransient<DataSeeder, DataSeeder>();

            //Add Jwt Authentication
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = "AdvertisementApp",
                        ValidAudience = "AdvertisementAppUsers",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Secret Jwt Token Key Do Not Share With Anyone")),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddMvc();

            //Cross Origin Resource Shareing
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, DataSeeder seeder)
        {
            //Hitelesítés
            app.UseAuthentication();

            //Cross Origin Resorce Shareing
            app.UseCors(builder => builder.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials());

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
