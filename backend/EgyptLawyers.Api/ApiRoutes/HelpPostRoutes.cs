using EgyptLawyers.Api.Auth;
using EgyptLawyers.Api.Contracts;
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
