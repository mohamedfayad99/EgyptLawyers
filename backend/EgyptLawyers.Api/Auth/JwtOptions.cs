namespace EgyptLawyers.Api.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "EgyptianLawyersNetwork";
    public string Audience { get; set; } = "EgyptianLawyersNetwork";

    /// <summary>
    /// Symmetric signing key. For dev you can keep a long random string.
    /// </summary>
    public string SigningKey { get; set; } = null!;

    public int ExpiryMinutes { get; set; } = 60 * 24 * 7;
}

