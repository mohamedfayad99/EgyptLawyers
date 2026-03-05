using EgyptLawyers.Api.Auth;
using EgyptLawyers.Api.Contracts;
using EgyptLawyers.Api.Services;
using EgyptLawyers.Data;
using EgyptLawyers.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Api.ApiRoutes;

public static class HelpPostRoutes
{
    public static void MapHelpPostRoutes(this IEndpointRouteBuilder api)
    {
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

            // ── Push Notifications (fire-and-forget) ───────────────────────
            // Capture local values before leaving the request scope.
            var capturedServices = ctx.RequestServices;
            var capturedLawyerId = lawyerId;
            var capturedCityId   = court.CityId;
            var capturedCourtId  = court.Id;
            var capturedCourtName = court.Name;
            var capturedPostId   = post.Id;

            _ = Task.Run(async () =>
            {
                try
                {
                    // Use a fresh DI scope — the request scope will be disposed shortly.
                    using var scope    = capturedServices.CreateScope();
                    var scopedDb       = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var push           = scope.ServiceProvider.GetRequiredService<ExpoPushService>();

                    // Poster name & city name for notification copy
                    var posterName = await scopedDb.Lawyers
                        .Where(x => x.Id == capturedLawyerId)
                        .Select(x => x.FullName)
                        .FirstOrDefaultAsync() ?? "A lawyer";

                    var cityName = await scopedDb.Cities
                        .Where(x => x.Id == capturedCityId)
                        .Select(x => x.Name)
                        .FirstOrDefaultAsync() ?? "your city";

                    // Lawyers who have the same city as an active city (excluding the poster)
                    var targetIds = await scopedDb.LawyerCities
                        .Where(lc => lc.CityId == capturedCityId && lc.LawyerId != capturedLawyerId)
                        .Select(lc => lc.LawyerId)
                        .Distinct()
                        .ToListAsync();

                    if (targetIds.Count == 0) return;

                    // Their registered Expo push tokens
                    var tokens = await scopedDb.DeviceRegistrations
                        .Where(d => targetIds.Contains(d.LawyerId))
                        .Select(d => d.DeviceToken)
                        .ToListAsync();

                    if (tokens.Count == 0) return;

                    await push.SendAsync(
                        tokens,
                        title: $"🆘 Help needed in {cityName}",
                        body:  $"{posterName} needs assistance at {capturedCourtName}. Tap to view.",
                        data:  new { postId = capturedPostId, cityId = capturedCityId, courtId = capturedCourtId }
                    );
                }
                catch
                {
                    // Notifications are best-effort — never crash the request
                }
            });
            // ── End Push ───────────────────────────────────────────────────

            return Results.Ok(new { post.Id, post.CityId, post.CourtId });
        }).RequireAuthorization("Lawyer").WithTags("Help Posts");

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
                    CityName = x.City.Name,
                    x.CourtId,
                    CourtName = x.Court.Name,
                    x.Description,
                    x.Status,
                    x.CreatedAtUtc,
                    x.LawyerId,
                    LawyerName = x.Lawyer.FullName,
                    ReplyCount = x.Replies.Count
                })
                .ToListAsync();

            return Results.Ok(posts);
        }).WithTags("Help Posts");

        api.MapGet("/help-posts/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var post = await db.HelpPosts.AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.Id,
                    x.CityId,
                    CityName = x.City.Name,
                    x.CourtId,
                    CourtName = x.Court.Name,
                    x.Description,
                    x.Status,
                    x.CreatedAtUtc,
                    x.LawyerId,
                    LawyerName = x.Lawyer.FullName,
                    LawyerWhatsapp = x.Lawyer.WhatsappNumber,
                    Replies = x.Replies.OrderBy(r => r.CreatedAtUtc).Select(r => new
                    {
                        r.Id,
                        r.LawyerId,
                        LawyerName = r.Lawyer.FullName,
                        LawyerWhatsapp = r.Lawyer.WhatsappNumber,
                        LawyerTitle = r.Lawyer.ProfessionalTitle,
                        r.Message,
                        r.CreatedAtUtc
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return post is null ? Results.NotFound() : Results.Ok(post);
        }).WithTags("Help Posts");

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
        }).RequireAuthorization("Lawyer").WithTags("Help Posts");
    }
}
