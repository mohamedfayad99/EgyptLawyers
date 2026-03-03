namespace EgyptLawyers.Api.ApiRoutes;

public static class RootRoutes
{
    public static void MapRootRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/", () => Results.Ok(new { name = "Egyptian Lawyers Network API", status = "ok" })).WithTags("Root");
    }
}
