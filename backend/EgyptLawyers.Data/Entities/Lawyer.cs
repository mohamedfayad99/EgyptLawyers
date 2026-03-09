using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class Lawyer
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(200)]
    public string FullName { get; set; } = null!;

    [MaxLength(200)]
    public string? ProfessionalTitle { get; set; }

    [MaxLength(100)]
    public string SyndicateCardNumber { get; set; } = null!;

    [MaxLength(32)]
    public string WhatsappNumber { get; set; } = null!;

    [MaxLength(500)]
    public string PasswordHash { get; set; } = null!;

    public LawyerVerificationStatus VerificationStatus { get; set; } = LawyerVerificationStatus.Pending;

    public bool IsSuspended { get; set; }

    [MaxLength(1000)]
    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<LawyerCity> ActiveCities { get; set; } = new();
    public List<HelpPost> Posts { get; set; } = new();
    public List<HelpPostReply> Replies { get; set; } = new();
    public List<DeviceRegistration> Devices { get; set; } = new();
}

