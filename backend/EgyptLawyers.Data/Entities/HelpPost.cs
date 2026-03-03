using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class HelpPost
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LawyerId { get; set; }
    public Lawyer Lawyer { get; set; } = null!;

    public int CourtId { get; set; }
    public Court Court { get; set; } = null!;

    public int CityId { get; set; }
    public City City { get; set; } = null!;

    [MaxLength(4000)]
    public string Description { get; set; } = null!;

    public HelpPostStatus Status { get; set; } = HelpPostStatus.Open;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<HelpPostAttachment> Attachments { get; set; } = new();
    public List<HelpPostReply> Replies { get; set; } = new();
}

