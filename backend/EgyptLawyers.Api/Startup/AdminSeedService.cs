using EgyptLawyers.Data;
using EgyptLawyers.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Api.Startup;

public static class AdminSeedService
{
    public static async Task SeedDefaultAdminAsync(IServiceProvider services, IConfiguration config, CancellationToken ct = default)
    {
        var email = config["AdminSeed:Email"];
        var password = config["AdminSeed:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (await db.AdminUsers.AnyAsync(ct))
            return;

        var hasher = new PasswordHasher<AdminUser>();
        var admin = new AdminUser
        {
            Email = email.Trim().ToLowerInvariant(),
            PasswordHash = "temp"
        };
        admin.PasswordHash = hasher.HashPassword(admin, password);

        db.AdminUsers.Add(admin);
        await db.SaveChangesAsync(ct);
    }
}

