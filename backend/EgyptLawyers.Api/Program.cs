using System.Text;
using EgyptLawyers.Api.Auth;
using EgyptLawyers.Api.Contracts;
using EgyptLawyers.Api.Startup;
using EgyptLawyers.Data;
using EgyptLawyers.Data.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EgyptLawyers API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", p =>
        p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});

builder.Services.AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection(JwtOptions.SectionName))
    .Validate(o => !string.IsNullOrWhiteSpace(o.SigningKey), "Jwt:SigningKey is required")
    .ValidateOnStart();

builder.Services.AddSingleton<JwtTokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()!;
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),
            RoleClaimType = "role",
            NameClaimType = "sub",
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Lawyer", p => p.RequireRole("Lawyer"));
    options.AddPolicy("Admin", p => p.RequireRole("Admin"));
});

var app = builder.Build();

app.UseCors("DevCors");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

// NOTE: MVP convenience: auto-create DB schema in development.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

await AdminSeedService.SeedDefaultAdminAsync(app.Services, app.Configuration);

app.MapGet("/", () => Results.Ok(new { name = "Egyptian Lawyers Network API", status = "ok" }));

var api = app.MapGroup("/api");

// Public: cities/courts
api.MapGet("/cities", async (AppDbContext db) =>
{
    var cities = await db.Cities.OrderBy(x => x.Name).Select(x => new { x.Id, x.Name }).ToListAsync();
    return Results.Ok(cities);
});

api.MapGet("/courts", async (int? cityId, AppDbContext db) =>
{
    var q = db.Courts.AsQueryable();
    if (cityId is not null) q = q.Where(x => x.CityId == cityId);
    var courts = await q.OrderBy(x => x.Name).Select(x => new { x.Id, x.Name, x.CityId }).ToListAsync();
    return Results.Ok(courts);
});

// Lawyer auth
api.MapPost("/lawyers/register", async (RegisterLawyerRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.FullName) ||
        string.IsNullOrWhiteSpace(req.SyndicateCardNumber) ||
        string.IsNullOrWhiteSpace(req.WhatsappNumber) ||
        string.IsNullOrWhiteSpace(req.Password))
        return Results.BadRequest(new { message = "Missing required fields." });

    var whatsapp = req.WhatsappNumber.Trim();
    var syndicate = req.SyndicateCardNumber.Trim();

    if (await db.Lawyers.AnyAsync(x => x.WhatsappNumber == whatsapp))
        return Results.Conflict(new { message = "WhatsApp number already registered." });

    if (await db.Lawyers.AnyAsync(x => x.SyndicateCardNumber == syndicate))
        return Results.Conflict(new { message = "Syndicate card number already registered." });

    var cityIds = (req.ActiveCityIds ?? Array.Empty<int>()).Distinct().ToArray();
    if (cityIds.Length == 0)
        return Results.BadRequest(new { message = "At least one active city is required." });

    var foundCityIds = await db.Cities.Where(c => cityIds.Contains(c.Id)).Select(c => c.Id).ToListAsync();
    if (foundCityIds.Count != cityIds.Length)
        return Results.BadRequest(new { message = "One or more active cities are invalid." });

    var lawyer = new Lawyer
    {
        FullName = req.FullName.Trim(),
        ProfessionalTitle = string.IsNullOrWhiteSpace(req.ProfessionalTitle) ? null : req.ProfessionalTitle.Trim(),
        SyndicateCardNumber = syndicate,
        WhatsappNumber = whatsapp,
        VerificationStatus = LawyerVerificationStatus.Pending,
        PasswordHash = "temp",
        CreatedAtUtc = DateTime.UtcNow,
        UpdatedAtUtc = DateTime.UtcNow,
    };

    var hasher = new PasswordHasher<Lawyer>();
    lawyer.PasswordHash = hasher.HashPassword(lawyer, req.Password);

    db.Lawyers.Add(lawyer);
    foreach (var cityId in cityIds)
        db.LawyerCities.Add(new LawyerCity { LawyerId = lawyer.Id, CityId = cityId });

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        lawyer.Id,
        lawyer.FullName,
        lawyer.WhatsappNumber,
        lawyer.VerificationStatus
    });
});

api.MapPost("/lawyers/login", async (LawyerLoginRequest req, AppDbContext db, JwtTokenService tokens) =>
{
    var whatsapp = (req.WhatsappNumber ?? "").Trim();
    var password = req.Password ?? "";

    var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.WhatsappNumber == whatsapp);
    if (lawyer is null)
        return Results.Unauthorized();

    if (lawyer.IsSuspended)
        return Results.Forbid();

    if (lawyer.VerificationStatus != LawyerVerificationStatus.Approved)
        return Results.Unauthorized();

    var hasher = new PasswordHasher<Lawyer>();
    var verified = hasher.VerifyHashedPassword(lawyer, lawyer.PasswordHash, password);
    if (verified == PasswordVerificationResult.Failed)
        return Results.Unauthorized();

    var token = tokens.CreateLawyerToken(lawyer);
    return Results.Ok(new { token });
});

api.MapGet("/lawyers/me", async (AppDbContext db, HttpContext ctx) =>
{
    var lawyerId = ctx.User.GetSubjectId();
    var lawyer = await db.Lawyers
        .Where(x => x.Id == lawyerId)
        .Select(x => new
        {
            x.Id,
            x.FullName,
            x.ProfessionalTitle,
            x.SyndicateCardNumber,
            x.WhatsappNumber,
            x.VerificationStatus,
            x.IsSuspended
        })
        .FirstOrDefaultAsync();

    return lawyer is null ? Results.NotFound() : Results.Ok(lawyer);
}).RequireAuthorization("Lawyer");

// Posts
api.MapPost("/help-posts", async (CreateHelpPostRequest req, AppDbContext db, HttpContext ctx) =>
{
    if (string.IsNullOrWhiteSpace(req.Description))
        return Results.BadRequest(new { message = "Description is required." });

    var lawyerId = ctx.User.GetSubjectId();

    var court = await db.Courts.FirstOrDefaultAsync(x => x.Id == req.CourtId);
    if (court is null)
        return Results.BadRequest(new { message = "Invalid court." });

    var post = new HelpPost
    {
        LawyerId = lawyerId,
        CourtId = court.Id,
        CityId = court.CityId,
        Description = req.Description.Trim(),
        Status = HelpPostStatus.Open,
        CreatedAtUtc = DateTime.UtcNow,
    };

    db.HelpPosts.Add(post);
    await db.SaveChangesAsync();

    // TODO (MVP): push notification delivery (FCM/OneSignal) based on CityId.
    return Results.Ok(new { post.Id, post.CityId, post.CourtId });
}).RequireAuthorization("Lawyer");

api.MapGet("/help-posts", async (int? cityId, int? courtId, AppDbContext db) =>
{
    var q = db.HelpPosts.AsNoTracking();
    if (cityId is not null) q = q.Where(x => x.CityId == cityId);
    if (courtId is not null) q = q.Where(x => x.CourtId == courtId);

    var posts = await q
        .OrderByDescending(x => x.CreatedAtUtc)
        .Take(100)
        .Select(x => new
        {
            x.Id,
            x.CityId,
            x.CourtId,
            x.Description,
            x.Status,
            x.CreatedAtUtc,
            x.LawyerId
        })
        .ToListAsync();

    return Results.Ok(posts);
});

api.MapGet("/help-posts/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var post = await db.HelpPosts.AsNoTracking()
        .Where(x => x.Id == id)
        .Select(x => new
        {
            x.Id,
            x.CityId,
            x.CourtId,
            x.Description,
            x.Status,
            x.CreatedAtUtc,
            x.LawyerId,
            Replies = x.Replies.OrderBy(r => r.CreatedAtUtc).Select(r => new
            {
                r.Id,
                r.LawyerId,
                r.Message,
                r.CreatedAtUtc
            }).ToList()
        })
        .FirstOrDefaultAsync();

    return post is null ? Results.NotFound() : Results.Ok(post);
});

api.MapPost("/help-posts/{id:guid}/replies", async (Guid id, CreateHelpPostReplyRequest req, AppDbContext db, HttpContext ctx) =>
{
    if (string.IsNullOrWhiteSpace(req.Message))
        return Results.BadRequest(new { message = "Message is required." });

    var lawyerId = ctx.User.GetSubjectId();

    var postExists = await db.HelpPosts.AnyAsync(x => x.Id == id && x.Status == HelpPostStatus.Open);
    if (!postExists)
        return Results.NotFound();

    var reply = new HelpPostReply
    {
        HelpPostId = id,
        LawyerId = lawyerId,
        Message = req.Message.Trim(),
        CreatedAtUtc = DateTime.UtcNow
    };

    db.HelpPostReplies.Add(reply);
    await db.SaveChangesAsync();

    return Results.Ok(new { reply.Id });
}).RequireAuthorization("Lawyer");

// Admin
var admin = api.MapGroup("/admin").RequireAuthorization("Admin");

api.MapPost("/admin/login", async (AdminLoginRequest req, AppDbContext db, JwtTokenService tokens) =>
{
    var email = (req.Email ?? "").Trim().ToLowerInvariant();
    var password = req.Password ?? "";

    var adminUser = await db.AdminUsers.FirstOrDefaultAsync(x => x.Email == email);
    if (adminUser is null || adminUser.IsDisabled)
        return Results.Unauthorized();

    var hasher = new PasswordHasher<AdminUser>();
    var verified = hasher.VerifyHashedPassword(adminUser, adminUser.PasswordHash, password);
    if (verified == PasswordVerificationResult.Failed)
        return Results.Unauthorized();

    var token = tokens.CreateAdminToken(adminUser);
    return Results.Ok(new { token });
});

admin.MapGet("/lawyers", async (string? status, AppDbContext db) =>
{
    var q = db.Lawyers.AsNoTracking();
    if (Enum.TryParse<LawyerVerificationStatus>(status ?? "", true, out var parsed))
        q = q.Where(x => x.VerificationStatus == parsed);

    var lawyers = await q
        .OrderByDescending(x => x.CreatedAtUtc)
        .Take(200)
        .Select(x => new
        {
            x.Id,
            x.FullName,
            x.ProfessionalTitle,
            x.SyndicateCardNumber,
            x.WhatsappNumber,
            x.VerificationStatus,
            x.IsSuspended,
            x.CreatedAtUtc
        })
        .ToListAsync();

    return Results.Ok(lawyers);
});

admin.MapPatch("/lawyers/{id:guid}/approve", async (Guid id, AppDbContext db) =>
{
    var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
    if (lawyer is null) return Results.NotFound();

    lawyer.VerificationStatus = LawyerVerificationStatus.Approved;
    lawyer.UpdatedAtUtc = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok();
});

admin.MapPatch("/lawyers/{id:guid}/reject", async (Guid id, AppDbContext db) =>
{
    var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
    if (lawyer is null) return Results.NotFound();

    lawyer.VerificationStatus = LawyerVerificationStatus.Rejected;
    lawyer.UpdatedAtUtc = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok();
});

admin.MapPatch("/lawyers/{id:guid}/suspend", async (Guid id, bool suspended, AppDbContext db) =>
{
    var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
    if (lawyer is null) return Results.NotFound();

    lawyer.IsSuspended = suspended;
    lawyer.UpdatedAtUtc = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok();
});

admin.MapPost("/cities", async (CreateCityRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Name))
        return Results.BadRequest(new { message = "Name is required." });

    var name = req.Name.Trim();
    if (await db.Cities.AnyAsync(x => x.Name == name))
        return Results.Conflict(new { message = "City already exists." });

    var city = new City { Name = name };
    db.Cities.Add(city);
    await db.SaveChangesAsync();
    return Results.Ok(new { city.Id, city.Name });
});

admin.MapPost("/courts", async (CreateCourtRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Name))
        return Results.BadRequest(new { message = "Name is required." });

    var cityExists = await db.Cities.AnyAsync(x => x.Id == req.CityId);
    if (!cityExists)
        return Results.BadRequest(new { message = "Invalid city." });

    var name = req.Name.Trim();
    if (await db.Courts.AnyAsync(x => x.Name == name))
        return Results.Conflict(new { message = "Court already exists." });

    var court = new Court { Name = name, CityId = req.CityId };
    db.Courts.Add(court);
    await db.SaveChangesAsync();
    return Results.Ok(new { court.Id, court.Name, court.CityId });
});

app.Run();
