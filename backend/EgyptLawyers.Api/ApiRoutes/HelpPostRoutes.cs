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
                Status = HelpPostStatus.Pending,
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
            var q = db.HelpPosts.AsNoTracking().Where(x => x.Status == HelpPostStatus.Open);
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
                    LawyerProfileImageUrl = x.Lawyer.ProfileImageUrl,
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
                    LawyerProfileImageUrl = x.Lawyer.ProfileImageUrl,
                    Replies = x.Replies.OrderBy(r => r.CreatedAtUtc).Select(r => new
                    {
                        r.Id,
                        r.LawyerId,
                        LawyerName = r.Lawyer.FullName,
                        LawyerWhatsapp = r.Lawyer.WhatsappNumber,
                        LawyerTitle = r.Lawyer.ProfessionalTitle,
                        LawyerProfileImageUrl = r.Lawyer.ProfileImageUrl,
                        r.Message,
                        r.CreatedAtUtc,
                        r.Rating
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

            // Create notification for the post author
            var post = await db.HelpPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (post != null && post.LawyerId != lawyerId)
            {
                var replierName = await db.Lawyers.Where(x => x.Id == lawyerId).Select(x => x.FullName).FirstOrDefaultAsync() ?? "A lawyer";
                db.Notifications.Add(new Notification
                {
                    LawyerId = post.LawyerId,
                    PostId = post.Id,
                    Message = req.Message.Trim(),
                    ReplierName = replierName,
                });
            }

            await db.SaveChangesAsync();

            return Results.Ok(new { reply.Id });
        }).RequireAuthorization("Lawyer").WithTags("Help Posts");

        api.MapPost("/help-posts/{id:guid}/replies/{replyId:guid}/rate", async (Guid id, Guid replyId, RateReplyRequest req, AppDbContext db, HttpContext ctx) =>
        {
            if (req.Rating < 1 || req.Rating > 5)
                return Results.BadRequest(new { message = "Rating must be between 1 and 5." });

            var lawyerId = ctx.User.GetSubjectId();

            var post = await db.HelpPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (post is null) return Results.NotFound();

            // Only the person who created the post can evaluate the replies
            if (post.LawyerId != lawyerId)
                return Results.Json(new { message = "Only the post owner can evaluate replies." }, statusCode: 403);

            var reply = await db.HelpPostReplies.FirstOrDefaultAsync(x => x.Id == replyId && x.HelpPostId == id);
            if (reply is null) return Results.NotFound();

            reply.Rating = req.Rating;
            await db.SaveChangesAsync();

            return Results.Ok();
        }).RequireAuthorization("Lawyer").WithTags("Help Posts");

        api.MapDelete("/help-posts/{id:guid}/replies/{replyId:guid}", async (Guid id, Guid replyId, AppDbContext db, HttpContext ctx) =>
        {
            var lawyerId = ctx.User.GetSubjectId();

            var post = await db.HelpPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (post is null) return Results.NotFound();

            // Only the post owner can delete any reply
            if (post.LawyerId != lawyerId)
                return Results.Json(new { message = "Only the post owner can delete replies." }, statusCode: 403);

            var reply = await db.HelpPostReplies.FirstOrDefaultAsync(x => x.Id == replyId && x.HelpPostId == id);
            if (reply is null) return Results.NotFound();

            db.HelpPostReplies.Remove(reply);
            await db.SaveChangesAsync();

            return Results.Ok();
        }).RequireAuthorization("Lawyer").WithTags("Help Posts");

        // --- Admin Routes ---

        api.MapGet("/admin/help-posts/pending", async (AppDbContext db) =>
        {
            var posts = await db.HelpPosts.AsNoTracking()
                .Where(x => x.Status == HelpPostStatus.Pending)
                .OrderByDescending(x => x.CreatedAtUtc)
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
        }).RequireAuthorization("Admin").WithTags("Admin Help Posts");

        api.MapGet("/admin/help-posts", async (int? cityId, int? courtId, AppDbContext db) =>
        {
            var q = db.HelpPosts.AsNoTracking()
                .Where(x => x.Status == HelpPostStatus.Pending || x.Status == HelpPostStatus.Open);

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
        }).RequireAuthorization("Admin").WithTags("Admin Help Posts");

        api.MapPost("/admin/help-posts/{id:guid}/approve", async (Guid id, AppDbContext db) =>
        {
            var post = await db.HelpPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (post is null) return Results.NotFound();

            post.Status = HelpPostStatus.Open;
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Post approved successfully." });
        }).RequireAuthorization("Admin").WithTags("Admin Help Posts");

        api.MapPost("/admin/help-posts/{id:guid}/reject", async (Guid id, AppDbContext db) =>
        {
            var post = await db.HelpPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (post is null) return Results.NotFound();

            post.Status = HelpPostStatus.Rejected;
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Post rejected successfully." });
        }).RequireAuthorization("Admin").WithTags("Admin Help Posts");

        api.MapDelete("/admin/help-posts/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var post = await db.HelpPosts
                .Include(x => x.Replies)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (post is null)
                return Results.NotFound();

            db.HelpPostReplies.RemoveRange(post.Replies);
            db.HelpPosts.Remove(post);

            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Post deleted successfully." });
        }).RequireAuthorization("Admin").WithTags("Admin Help Posts");
    }
}
