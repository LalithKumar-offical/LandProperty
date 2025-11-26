using LandProperty.Api;
using LandProperty.Infrastructure.Middlewares;
using LoanProperty.Manager;
using LoanProperty.Repo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Repository + Manager + API dependencies
builder.Services.AddRepositoryDependencies(builder.Configuration.GetConnectionString("conn"));
builder.Services.AddServiceDependencies(builder.Environment);
builder.Services.AddApiDependencies();

// ? JWT configuration (reads token from cookie)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"]!)
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };

    // ? Tell JWT middleware to read token from cookie instead of Authorization header
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwtToken"))
            {
                context.Token = context.Request.Cookies["jwtToken"];
            }
            return Task.CompletedTask;
        }
    };
});

// ? Enable CORS (for frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ? Global Exception Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// Swagger only for development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ? Must be before auth — allow frontend with credentials

app.UseCors("AllowFrontend");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads"
});

// ? Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();