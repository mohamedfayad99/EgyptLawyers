using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class HelpPostReply
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid HelpPostId { get; set; }
    public HelpPost HelpPost { get; set; } = null!;

    public Guid LawyerId { get; set; }
    public Lawyer Lawyer { get; set; } = null!;

    [MaxLength(4000)]
    public string Message { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<HelpPostReplyAttachment> Attachments { get; set; } = new();
    public int? Rating { get; set; }
}

