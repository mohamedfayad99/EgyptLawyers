using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class DeviceRegistration
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LawyerId { get; set; }
    public Lawyer Lawyer { get; set; } = null!;

    [MaxLength(512)]
    public string DeviceToken { get; set; } = null!;

    public DevicePlatform Platform { get; set; } = DevicePlatform.Unknown;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

