using System.Security.Claims;
using System.Text;
using EgyptLawyers.Data.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace EgyptLawyers.Api.Auth;

public sealed class JwtTokenService
{
    private readonly JwtOptions _options;

    public JwtTokenService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string CreateLawyerToken(Lawyer lawyer)
    {
        var claims = new List<Claim>
        {
            new("sub", lawyer.Id.ToString()),
            new("role", "Lawyer"),
            new("whatsapp", lawyer.WhatsappNumber),
            new("fullName", lawyer.FullName),
        };

        return CreateToken(claims);
    }

    public string CreateAdminToken(AdminUser admin)
    {
        var claims = new List<Claim>
        {
            new("sub", admin.Id.ToString()),
            new("role", "Admin"),
            new("email", admin.Email),
        };

        return CreateToken(claims);
    }

    private string CreateToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

