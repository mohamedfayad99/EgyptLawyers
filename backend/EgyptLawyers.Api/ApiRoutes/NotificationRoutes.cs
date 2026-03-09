using EgyptLawyers.Api.Auth;
using EgyptLawyers.Data;
using EgyptLawyers.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Api.ApiRoutes;

public static class NotificationRoutes
{
    public static void MapNotificationRoutes(this IEndpointRouteBuilder api)
    {
        var group = api.MapGroup("/notifications").RequireAuthorization("Lawyer").WithTags("Notifications");

        group.MapGet("/", async (AppDbContext db, HttpContext ctx) =>
        {
            var lawyerId = ctx.User.GetSubjectId();
            var notifications = await db.Notifications
                .Where(x => x.LawyerId == lawyerId)
                .OrderByDescending(x => x.CreatedAtUtc)
                .Select(x => new
                {
                    x.Id,
                    x.PostId,
                    PostDescription = x.HelpPost.Description,
                    x.ReplierName,
                    x.Message,
                    x.IsRead,
                    x.CreatedAtUtc
                })
                .ToListAsync();

            return Results.Ok(notifications);
        });

        group.MapPut("/{id:guid}/read", async (Guid id, AppDbContext db, HttpContext ctx) =>
        {
            var lawyerId = ctx.User.GetSubjectId();
            var notification = await db.Notifications.FirstOrDefaultAsync(x => x.Id == id && x.LawyerId == lawyerId);
            if (notification is null) return Results.NotFound();

            notification.IsRead = true;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db, HttpContext ctx) =>
        {
            var lawyerId = ctx.User.GetSubjectId();
            var notification = await db.Notifications.FirstOrDefaultAsync(x => x.Id == id && x.LawyerId == lawyerId);
            if (notification is null) return Results.NotFound();

            db.Notifications.Remove(notification);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
