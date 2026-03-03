using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class HelpPostAttachment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid HelpPostId { get; set; }
    public HelpPost HelpPost { get; set; } = null!;

    [MaxLength(2000)]
    public string FileUrl { get; set; } = null!;

    [MaxLength(100)]
    public string FileType { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

