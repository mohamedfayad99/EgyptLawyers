using EgyptLawyers.Data;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Api.ApiRoutes;

public static class LookupRoutes
{
    public static void MapLookupRoutes(this IEndpointRouteBuilder api)
    {
        api.MapGet("/cities", async (AppDbContext db) =>
        {
            var cities = await db.Cities.OrderBy(x => x.Name).Select(x => new { x.Id, x.Name }).ToListAsync();
            return Results.Ok(cities);
        }).WithTags("Lookup");

        api.MapGet("/courts", async (int? cityId, AppDbContext db) =>
        {
            var q = db.Courts.AsQueryable();
            if (cityId is not null) q = q.Where(x => x.CityId == cityId);
            var courts = await q.OrderBy(x => x.Name).Select(x => new { x.Id, x.Name, x.CityId }).ToListAsync();
            return Results.Ok(courts);
        }).WithTags("Lookup");

        // Additional route pattern used by mobile app: /cities/{id}/courts
        api.MapGet("/cities/{id:int}/courts", async (int id, AppDbContext db) =>
        {
            var courts = await db.Courts
                .Where(x => x.CityId == id)
                .OrderBy(x => x.Name)
                .Select(x => new { x.Id, x.Name, x.CityId })
                .ToListAsync();
            return Results.Ok(courts);
        }).WithTags("Lookup");
    }
}
