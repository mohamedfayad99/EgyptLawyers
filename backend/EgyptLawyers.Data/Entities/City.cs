using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class City
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = null!;

    public List<Court> Courts { get; set; } = new();
    public List<LawyerCity> Lawyers { get; set; } = new();
}

