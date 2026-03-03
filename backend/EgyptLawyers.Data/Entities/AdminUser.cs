using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class AdminUser
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(320)]
    public string Email { get; set; } = null!;

    [MaxLength(500)]
    public string PasswordHash { get; set; } = null!;

    public bool IsDisabled { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

