using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EgyptLawyers.Data.Entities;

public sealed class Notification
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LawyerId { get; set; }
    [ForeignKey(nameof(LawyerId))]
    public Lawyer Lawyer { get; set; } = null!;

    public Guid PostId { get; set; }
    [ForeignKey(nameof(PostId))]
    public HelpPost HelpPost { get; set; } = null!;

    [MaxLength(500)]
    public string Message { get; set; } = null!;

    [MaxLength(100)]
    public string ReplierName { get; set; } = null!;

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
