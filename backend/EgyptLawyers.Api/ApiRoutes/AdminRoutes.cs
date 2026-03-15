using EgyptLawyers.Api.Auth;
using EgyptLawyers.Api.Contracts;
using EgyptLawyers.Data;
using EgyptLawyers.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Api.ApiRoutes;

public static class AdminRoutes
{
    public static void MapAdminRoutes(this IEndpointRouteBuilder api)
    {
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
        }).WithTags("Admin");

        var admin = api.MapGroup("/admin").RequireAuthorization("Admin").WithTags("Admin");

        admin.MapGet("/lawyers", async (string? status, AppDbContext db) =>
        {
            var q = db.Lawyers.AsNoTracking();
            if (Enum.TryParse<LawyerVerificationStatus>(status ?? "", true, out var parsed))
                q = q.Where(x => x.VerificationStatus == parsed);

            var lawyers = await q
                .Include(x => x.ActiveCities).ThenInclude(x => x.City)
                .OrderByDescending(x => x.CreatedAtUtc)
                .Take(200)
                .Select(x => new
                {
                    x.Id,
                    x.FullName,
                    x.ProfessionalTitle,
                    x.SyndicateCardNumber,
                    x.NationalIdNumber,
                    x.WhatsappNumber,
                    x.VerificationStatus,
                    x.IsSuspended,
                    x.ProfileImageUrl,
                    x.IdCardImageUrl,
                    x.CreatedAtUtc,
                    x.UpdatedAtUtc,
                    ActiveCities = x.ActiveCities.Select(c => c.City.Name).ToList()
                })
                .ToListAsync();

            return Results.Ok(lawyers);
        }).WithTags("Admin");

        admin.MapGet("/lawyers/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers
                .AsNoTracking()
                .Include(x => x.ActiveCities).ThenInclude(x => x.City)
                .Select(x => new
                {
                    x.Id,
                    x.FullName,
                    x.ProfessionalTitle,
                    x.SyndicateCardNumber,
                    x.NationalIdNumber,
                    x.WhatsappNumber,
                    x.VerificationStatus,
                    x.IsSuspended,
                    x.ProfileImageUrl,
                    x.IdCardImageUrl,
                    x.CreatedAtUtc,
                    x.UpdatedAtUtc,
                    ActiveCities = x.ActiveCities.Select(c => c.City.Name).ToList()
                })
                .FirstOrDefaultAsync(x => x.Id == id);

            if (lawyer is null) return Results.NotFound();
            return Results.Ok(lawyer);
        }).WithTags("Admin");

        admin.MapPatch("/lawyers/{id:guid}/approve", async (Guid id, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
            if (lawyer is null) return Results.NotFound();

            lawyer.VerificationStatus = LawyerVerificationStatus.Approved;
            lawyer.IsSuspended = false; // Ensure unblocking if they were suspended
            lawyer.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        }).WithTags("Admin");

        admin.MapPatch("/lawyers/{id:guid}/reject", async (Guid id, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
            if (lawyer is null) return Results.NotFound();

            lawyer.VerificationStatus = LawyerVerificationStatus.Rejected;
            lawyer.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        }).WithTags("Admin");

        admin.MapPatch("/lawyers/{id:guid}/suspend", async (Guid id, bool suspended, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
            if (lawyer is null) return Results.NotFound();

            lawyer.IsSuspended = suspended;
            lawyer.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        }).WithTags("Admin");

        admin.MapPatch("/lawyers/{id:guid}/reset-password", async (Guid id, ResetLawyerPasswordRequest req, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
                return Results.BadRequest(new { message = "Password must be at least 6 characters." });

            var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
            if (lawyer is null) return Results.NotFound();

            var hasher = new PasswordHasher<Lawyer>();
            lawyer.PasswordHash = hasher.HashPassword(lawyer, req.NewPassword);
            lawyer.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok(new { message = "Password reset successfully." });
        }).WithTags("Admin");

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
        }).WithTags("Admin");

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
        }).WithTags("Admin");

        admin.MapGet("/cities/details", async (AppDbContext db) =>
        {
            var cities = await db.Cities
                .OrderBy(x => x.Name)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    LawyersCount = db.LawyerCities.Count(lc => lc.CityId == c.Id),
                    CourtsCount = db.Courts.Count(court => court.CityId == c.Id)
                })
                .ToListAsync();
            return Results.Ok(cities);
        }).WithTags("Admin");

        admin.MapGet("/courts/details", async (AppDbContext db) =>
        {
            var courts = await db.Courts
                .Include(c => c.City)
                .OrderBy(x => x.Name)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.CityId,
                    CityName = c.City.Name,
                    LawyersCount = db.LawyerCities.Count(lc => lc.CityId == c.CityId),
                    PostsCount = db.HelpPosts.Count(hp => hp.CourtId == c.Id)
                })
                .ToListAsync();
            return Results.Ok(courts);
        }).WithTags("Admin");

        // --- Management Routes for Cities ---

        admin.MapPut("/cities/{id:int}", async (int id, CreateCityRequest req, AppDbContext db) =>
        {
            var city = await db.Cities.FirstOrDefaultAsync(x => x.Id == id);
            if (city is null) return Results.NotFound();

            if (string.IsNullOrWhiteSpace(req.Name))
                return Results.BadRequest(new { message = "Name is required." });

            city.Name = req.Name.Trim();
            await db.SaveChangesAsync();
            return Results.Ok(city);
        }).WithTags("Admin");

        admin.MapDelete("/cities/{id:int}", async (int id, AppDbContext db) =>
        {
            var city = await db.Cities.FirstOrDefaultAsync(x => x.Id == id);
            if (city is null) return Results.NotFound();

            // Cascade delete: find all courts in this city
            var cityCourts = await db.Courts.Where(x => x.CityId == id).ToListAsync();
            var cityPosts = await db.HelpPosts.Where(hp => hp.CityId == id).ToListAsync();
            
            // Delete replies for all posts in this city
            foreach(var post in cityPosts)
            {
                var replies = await db.HelpPostReplies.Where(r => r.HelpPostId == post.Id).ToListAsync();
                db.HelpPostReplies.RemoveRange(replies);
            }

            db.HelpPosts.RemoveRange(cityPosts);
            db.Courts.RemoveRange(cityCourts);
            db.Cities.Remove(city);
            
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).WithTags("Admin");

        // --- Management Routes for Courts ---

        admin.MapPut("/courts/{id:int}", async (int id, CreateCourtRequest req, AppDbContext db) =>
        {
            var court = await db.Courts.FirstOrDefaultAsync(x => x.Id == id);
            if (court is null) return Results.NotFound();

            if (string.IsNullOrWhiteSpace(req.Name))
                return Results.BadRequest(new { message = "Name is required." });

            court.Name = req.Name.Trim();
            court.CityId = req.CityId;
            await db.SaveChangesAsync();
            return Results.Ok(court);
        }).WithTags("Admin");

        admin.MapDelete("/courts/{id:int}", async (int id, AppDbContext db) =>
        {
            var court = await db.Courts.FirstOrDefaultAsync(x => x.Id == id);
            if (court is null) return Results.NotFound();

            // Cascade delete: find all posts in this court
            var courtPosts = await db.HelpPosts.Where(hp => hp.CourtId == id).ToListAsync();
            foreach(var post in courtPosts)
            {
                var replies = await db.HelpPostReplies.Where(r => r.HelpPostId == post.Id).ToListAsync();
                db.HelpPostReplies.RemoveRange(replies);
            }
            db.HelpPosts.RemoveRange(courtPosts);

            db.Courts.Remove(court);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).WithTags("Admin");

        // --- Management Routes for Lawyers ---

        admin.MapDelete("/lawyers/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers
                .Include(x => x.ActiveCities)
                .Include(x => x.Posts)
                .Include(x => x.Replies)
                .FirstOrDefaultAsync(x => x.Id == id);
            
            if (lawyer is null) return Results.NotFound();

            // Cleanup related data if necessary or let Cascading handle it
            db.LawyerCities.RemoveRange(lawyer.ActiveCities);
            db.HelpPostReplies.RemoveRange(lawyer.Replies);
            db.HelpPosts.RemoveRange(lawyer.Posts);
            db.Lawyers.Remove(lawyer);

            await db.SaveChangesAsync();
            return Results.NoContent();
        }).WithTags("Admin");

        admin.MapGet("/statistics", async (AppDbContext db) =>
        {
            var citiesWithMostPosts = await db.HelpPosts
                .GroupBy(x => x.City.Name)
                .Select(g => new { City = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            var citiesWithMostLawyers = await db.LawyerCities
                .GroupBy(x => x.City.Name)
                .Select(g => new { City = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            var citiesWithActivity = await db.Cities
                .Select(c => new
                {
                    City = c.Name,
                    Count = db.HelpPosts.Count(hp => hp.CityId == c.Id)
                })
                .OrderByDescending(x => x.Count)
                .Take(50)
                .ToListAsync();

            var courtsWithMostRequests = await db.HelpPosts
                .GroupBy(x => x.Court.Name)
                .Select(g => new { Court = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            var courtsPerCity = await db.Courts
                .GroupBy(x => x.City.Name)
                .Select(g => new { City = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            var courtsWithRequests = await db.Courts
                .Select(c => new
                {
                    Court = c.Name,
                    City = c.City.Name,
                    Count = db.HelpPosts.Count(hp => hp.CourtId == c.Id)
                })
                .OrderByDescending(x => x.Count)
                .Take(50)
                .ToListAsync();

            var verifiedVsPending = await db.Lawyers
                .GroupBy(x => x.VerificationStatus)
                .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                .ToListAsync();

            var activeLawyersCreators = await db.HelpPosts
                .Select(x => x.LawyerId)
                .Distinct()
                .CountAsync();

            var activeLawyersRepliers = await db.HelpPostReplies
                .Select(x => x.LawyerId)
                .Distinct()
                .CountAsync();

            var topContributingLawyers = await db.HelpPostReplies
                .GroupBy(x => new { x.LawyerId, x.Lawyer.FullName })
                .Select(g => new { Lawyer = g.Key.FullName, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            var postsTrendDb = await db.HelpPosts
                .Where(x => x.CreatedAtUtc >= thirtyDaysAgo)
                .Select(x => new { x.CreatedAtUtc })
                .ToListAsync();
                
            var postsTrend = postsTrendDb
                .GroupBy(x => x.CreatedAtUtc.Date)
                .Select(g => new
                {
                    Day = g.Key.ToString("MMM dd"),
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .Select(x => new { x.Day, x.Count })
                .ToList();

            var cityActivityStacked = await db.Cities
                .Select(c => new
                {
                    City = c.Name,
                    Posts = db.HelpPosts.Count(hp => hp.CityId == c.Id),
                    Replies = db.HelpPostReplies.Count(r => r.HelpPost.CityId == c.Id)
                })
                .OrderByDescending(x => (x.Posts + x.Replies))
                .Take(10)
                .ToListAsync();

            var lawyerGrowth = await db.Lawyers
                .GroupBy(x => new { x.CreatedAtUtc.Year, x.CreatedAtUtc.Month })
                .Select(g => new { Year = g.Key.Year, Month = g.Key.Month, Count = g.Count() })
                .OrderByDescending(x => x.Year).ThenByDescending(x => x.Month)
                .Take(2)
                .ToListAsync();

            double lawyerTrend = 0;
            if (lawyerGrowth.Count == 2 && lawyerGrowth[1].Count > 0)
            {
                lawyerTrend = Math.Round(((double)lawyerGrowth[0].Count - lawyerGrowth[1].Count) / (double)lawyerGrowth[1].Count * 100, 1);
            }

            return Results.Ok(new
            {
                CitiesWithMostPosts = citiesWithMostPosts,
                CitiesWithMostLawyers = citiesWithMostLawyers,
                CitiesWithActivity = citiesWithActivity,
                CourtsWithMostRequests = courtsWithMostRequests,
                CourtsPerCity = courtsPerCity,
                CourtsWithRequests = courtsWithRequests,
                VerifiedVsPendingLawyers = verifiedVsPending,
                ActiveLawyersCreators = activeLawyersCreators,
                ActiveLawyersRepliers = activeLawyersRepliers,
                TopContributingLawyers = topContributingLawyers,
                PostsTrend = postsTrend,
                CityActivityStacked = cityActivityStacked,
                LawyerTrend = (lawyerTrend >= 0 ? "+" : "") + lawyerTrend + "%"
            });
        }).WithTags("Admin");
    }
}
