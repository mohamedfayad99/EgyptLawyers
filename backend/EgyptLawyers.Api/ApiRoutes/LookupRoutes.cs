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
    }
}
