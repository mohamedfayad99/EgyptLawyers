using System.Security.Claims;

namespace EgyptLawyers.Api.Auth;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetSubjectId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue("sub") ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(sub!);
    }
}

