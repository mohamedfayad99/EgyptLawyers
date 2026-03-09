using EgyptLawyers.Api.Auth;
using EgyptLawyers.Api.Contracts;
using EgyptLawyers.Data;
using EgyptLawyers.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Api.ApiRoutes;

public static class LawyerRoutes
{
    public static void MapLawyerRoutes(this IEndpointRouteBuilder api)
    {
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

            if (!string.IsNullOrWhiteSpace(req.ProfileImageBase64))
            {
                try
                {
                    var base64Data = req.ProfileImageBase64.Contains(",") 
                        ? req.ProfileImageBase64.Split(',')[1] 
                        : req.ProfileImageBase64;
                    var bytes = Convert.FromBase64String(base64Data);
                    var dir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile_images");
                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                    var fileName = $"{lawyer.Id}.jpg";
                    await File.WriteAllBytesAsync(Path.Combine(dir, fileName), bytes);
                    lawyer.ProfileImageUrl = $"/profile_images/{fileName}";
                }
                catch { /* Ignore invalid base64 */ }
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                lawyer.Id,
                lawyer.FullName,
                lawyer.WhatsappNumber,
                lawyer.VerificationStatus,
                lawyer.ProfileImageUrl
            });
        }).WithTags("Lawyers");

        api.MapPost("/lawyers/login", async (LawyerLoginRequest req, AppDbContext db, JwtTokenService tokens) =>
        {
            var whatsapp = (req.WhatsappNumber ?? "").Trim();
            var password = req.Password ?? "";

            var lawyer = await db.Lawyers.FirstOrDefaultAsync(x => x.WhatsappNumber == whatsapp);
            if (lawyer is null)
                return Results.Json(new { message = "not exist" }, statusCode: 401);

            if (lawyer.IsSuspended)
                return Results.Json(new { message = "suspended" }, statusCode: 403);

            if (lawyer.VerificationStatus == LawyerVerificationStatus.Pending)
                return Results.Json(new { message = "pending" }, statusCode: 401);

            if (lawyer.VerificationStatus == LawyerVerificationStatus.Rejected)
                return Results.Json(new { message = "rejected" }, statusCode: 401);

            var hasher = new PasswordHasher<Lawyer>();
            var verified = hasher.VerifyHashedPassword(lawyer, lawyer.PasswordHash, password);
            if (verified == PasswordVerificationResult.Failed)
                return Results.Json(new { message = "invalid credentials" }, statusCode: 401);

            var token = tokens.CreateLawyerToken(lawyer);
            return Results.Ok(new { token });
        }).WithTags("Lawyers");

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
                    x.IsSuspended,
                    x.ProfileImageUrl,
                    ActiveCities = x.ActiveCities.Select(c => new { c.City.Id, c.City.Name }).ToList()
                })
                .FirstOrDefaultAsync();

            return lawyer is null ? Results.NotFound() : Results.Ok(lawyer);
        }).RequireAuthorization("Lawyer").WithTags("Lawyers");

        api.MapGet("/lawyers/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var lawyer = await db.Lawyers
                .Where(x => x.Id == id && x.VerificationStatus == LawyerVerificationStatus.Approved && !x.IsSuspended)
                .Select(x => new
                {
                    x.Id,
                    x.FullName,
                    x.ProfessionalTitle,
                    x.SyndicateCardNumber,
                    x.WhatsappNumber,
                    x.VerificationStatus,
                    x.ProfileImageUrl,
                    ActiveCities = x.ActiveCities.Select(c => new { c.City.Id, c.City.Name }).ToList()
                })
                .FirstOrDefaultAsync();

            return lawyer is null ? Results.NotFound() : Results.Ok(lawyer);
        }).RequireAuthorization("Lawyer").WithTags("Lawyers");

        api.MapPut("/lawyers/me", async (UpdateLawyerProfileRequest req, AppDbContext db, HttpContext ctx) =>
        {
            var lawyerId = ctx.User.GetSubjectId();
            var lawyer = await db.Lawyers
                .Include(x => x.ActiveCities)
                .FirstOrDefaultAsync(x => x.Id == lawyerId);

            if (lawyer is null) return Results.NotFound();

            if (string.IsNullOrWhiteSpace(req.FullName) || string.IsNullOrWhiteSpace(req.WhatsappNumber))
                return Results.BadRequest(new { message = "Full name and WhatsApp number are required." });
            
            var whatsapp = req.WhatsappNumber.Trim();
            if (lawyer.WhatsappNumber != whatsapp && await db.Lawyers.AnyAsync(x => x.WhatsappNumber == whatsapp))
                return Results.Conflict(new { message = "WhatsApp number already registered by another account." });

            var cityIds = (req.ActiveCityIds ?? Array.Empty<int>()).Distinct().ToArray();
            if (cityIds.Length == 0)
                return Results.BadRequest(new { message = "At least one active city is required." });

            var foundCityIds = await db.Cities.Where(c => cityIds.Contains(c.Id)).Select(c => c.Id).ToListAsync();
            if (foundCityIds.Count != cityIds.Length)
                return Results.BadRequest(new { message = "One or more active cities are invalid." });

            lawyer.FullName = req.FullName.Trim();
            lawyer.ProfessionalTitle = string.IsNullOrWhiteSpace(req.ProfessionalTitle) ? null : req.ProfessionalTitle.Trim();
            lawyer.WhatsappNumber = whatsapp;
            lawyer.UpdatedAtUtc = DateTime.UtcNow;

            db.LawyerCities.RemoveRange(lawyer.ActiveCities);
            foreach (var cityId in cityIds)
                db.LawyerCities.Add(new LawyerCity { LawyerId = lawyer.Id, CityId = cityId });

            if (!string.IsNullOrWhiteSpace(req.ProfileImageBase64))
            {
                try
                {
                    var base64Data = req.ProfileImageBase64.Contains(",") 
                        ? req.ProfileImageBase64.Split(',')[1] 
                        : req.ProfileImageBase64;
                    var bytes = Convert.FromBase64String(base64Data);
                    var dir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile_images");
                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                    var fileName = $"{lawyer.Id}.jpg";
                    await File.WriteAllBytesAsync(Path.Combine(dir, fileName), bytes);
                    lawyer.ProfileImageUrl = $"/profile_images/{fileName}";
                }
                catch { /* Ignore invalid base64 */ }
            }

            await db.SaveChangesAsync();
            return Results.Ok();
        }).RequireAuthorization("Lawyer").WithTags("Lawyers");

        api.MapPost("/lawyers/devices", async (RegisterDeviceRequest req, AppDbContext db, HttpContext ctx) =>
        {
            if (string.IsNullOrWhiteSpace(req.DeviceToken))
                return Results.BadRequest(new { message = "DeviceToken is required." });

            var lawyerId = ctx.User.GetSubjectId();
            var token = req.DeviceToken.Trim();

            var existing = await db.DeviceRegistrations.FirstOrDefaultAsync(x => x.DeviceToken == token);
            if (existing is not null)
            {
                existing.LawyerId = lawyerId;
            }
            else
            {
                db.DeviceRegistrations.Add(new DeviceRegistration
                {
                    LawyerId = lawyerId,
                    DeviceToken = token,
                    Platform = req.Platform ?? DevicePlatform.Unknown,
                    CreatedAtUtc = DateTime.UtcNow
                });
            }

            await db.SaveChangesAsync();
            return Results.Ok();
        }).RequireAuthorization("Lawyer").WithTags("Lawyers");
    }
}
