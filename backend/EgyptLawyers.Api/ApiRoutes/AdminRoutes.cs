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
        }).WithTags("Admin");

        admin.MapPatch("/lawyers/{id:guid}/approve", async (Guid id, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.Id == id);
            if (lawyer is null) return Results.NotFound();

            lawyer.VerificationStatus = LawyerVerificationStatus.Approved;
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
    }
}
