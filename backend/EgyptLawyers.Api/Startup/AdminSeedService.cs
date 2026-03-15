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

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var existingAdmin = await db.AdminUsers.FirstOrDefaultAsync(x => x.Email == normalizedEmail, ct);

        if (existingAdmin != null)
        {
            // Optional: Update password if needed, or just return
            var hasher = new PasswordHasher<AdminUser>();
            existingAdmin.PasswordHash = hasher.HashPassword(existingAdmin, password);
            db.AdminUsers.Update(existingAdmin);
            await db.SaveChangesAsync(ct);
            return;
        }

        var hasherNew = new PasswordHasher<AdminUser>();
        var admin = new AdminUser
        {
            Email = normalizedEmail,
            PasswordHash = "temp"
        };
        admin.PasswordHash = hasherNew.HashPassword(admin, password);

        db.AdminUsers.Add(admin);
        await db.SaveChangesAsync(ct);
    }
}

