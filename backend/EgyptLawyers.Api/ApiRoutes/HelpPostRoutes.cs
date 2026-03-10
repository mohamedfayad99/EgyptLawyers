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
        api.MapPost("/help-posts", async (HttpRequest request, AppDbContext db, HttpContext ctx, IWebHostEnvironment env) =>
        {
            var form = await request.ReadFormAsync();
            var description = form["description"].ToString();
            var courtIdStr = form["courtId"].ToString();

            if (string.IsNullOrWhiteSpace(description))
                return Results.BadRequest(new { message = "Description is required." });

            if (!int.TryParse(courtIdStr, out var courtId))
                return Results.BadRequest(new { message = "Invalid court ID." });

            var lawyerId = ctx.User.GetSubjectId();

            var court = await db.Courts.FirstOrDefaultAsync(x => x.Id == courtId);
            if (court is null)
                return Results.BadRequest(new { message = "Invalid court." });

            var post = new HelpPost
            {
                LawyerId = lawyerId,
                CourtId = court.Id,
                CityId = court.CityId,
                Description = description.Trim(),
                Status = HelpPostStatus.Pending,
                CreatedAtUtc = DateTime.UtcNow,
            };

            // Handle Attachments
            foreach (var file in request.Form.Files)
            {
                var fileUrl = await SaveFileAsync(file, "posts", env);
                post.Attachments.Add(new HelpPostAttachment
                {
                    FileUrl = fileUrl,
                    FileType = file.ContentType
                });
            }

            db.HelpPosts.Add(post);
            await db.SaveChangesAsync();

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
                    ReplyCount = x.Replies.Count,
                    Attachments = x.Attachments.Select(a => new { a.Id, a.FileUrl, a.FileType }).ToList()
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
                    Attachments = x.Attachments.Select(a => new { a.Id, a.FileUrl, a.FileType }).ToList(),
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
                        r.Rating,
                        Attachments = r.Attachments.Select(a => new { a.Id, a.FileUrl, a.FileType }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return post is null ? Results.NotFound() : Results.Ok(post);
        }).WithTags("Help Posts");

        api.MapPost("/help-posts/{id:guid}/replies", async (Guid id, HttpRequest request, AppDbContext db, HttpContext ctx, IWebHostEnvironment env) =>
        {
            var form = await request.ReadFormAsync();
            var message = form["message"].ToString();

            if (string.IsNullOrWhiteSpace(message))
                return Results.BadRequest(new { message = "Message is required." });

            var lawyerId = ctx.User.GetSubjectId();

            var postExists = await db.HelpPosts.AnyAsync(x => x.Id == id && x.Status == HelpPostStatus.Open);
            if (!postExists)
                return Results.NotFound();

            var reply = new HelpPostReply
            {
                HelpPostId = id,
                LawyerId = lawyerId,
                Message = message.Trim(),
                CreatedAtUtc = DateTime.UtcNow
            };

            // Handle Attachments
            foreach (var file in request.Form.Files)
            {
                var fileUrl = await SaveFileAsync(file, "replies", env);
                reply.Attachments.Add(new HelpPostReplyAttachment
                {
                    FileUrl = fileUrl,
                    FileType = file.ContentType
                });
            }

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
                    Message = message.Trim(),
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

        api.MapPost("/admin/help-posts/{id:guid}/approve", async (Guid id, AppDbContext db, ExpoPushService push) =>
        {
            var post = await db.HelpPosts
                .Include(x => x.Lawyer)
                .Include(x => x.City)
                .Include(x => x.Court)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (post is null) return Results.NotFound();

            post.Status = HelpPostStatus.Open;

            // ── Notify lawyers in the same city ──
            var targetLawyerIds = await db.LawyerCities
                .Where(lc => lc.CityId == post.CityId && lc.LawyerId != post.LawyerId)
                .Select(lc => lc.LawyerId)
                .Distinct()
                .ToListAsync();

            if (targetLawyerIds.Any())
            {
                // 1. Create Internal Notifications (for the bell icon list)
                foreach (var lawyerId in targetLawyerIds)
                {
                    db.Notifications.Add(new Notification
                    {
                        LawyerId = lawyerId,
                        PostId = post.Id,
                        Message = post.Description.Length > 100 ? post.Description[..100] + "..." : post.Description,
                        ReplierName = post.Lawyer.FullName, // Using Author Name as the "Notifier"
                    });
                }

                // 2. Send Push Notifications
                var tokens = await db.DeviceRegistrations
                    .Where(d => targetLawyerIds.Contains(d.LawyerId))
                    .Select(d => d.DeviceToken)
                    .ToListAsync();

                if (tokens.Any())
                {
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            await push.SendAsync(
                                tokens,
                                title: $"🆘 Help needed in {post.City.Name}",
                                body: $"{post.Lawyer.FullName} needs assistance at {post.Court.Name}. Tap to view.",
                                data: new { postId = post.Id, cityId = post.CityId, courtId = post.CourtId }
                            );
                        }
                        catch { /* Best effort push */ }
                    });
                }
            }

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

    private static async Task<string> SaveFileAsync(IFormFile file, string subFolder, IWebHostEnvironment env)
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var uploadsPath = Path.Combine(env.WebRootPath, "uploads", subFolder);
        if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

        var filePath = Path.Combine(uploadsPath, fileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/uploads/{subFolder}/{fileName}";
    }
}
