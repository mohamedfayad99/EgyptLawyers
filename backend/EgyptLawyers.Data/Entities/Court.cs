using System.ComponentModel.DataAnnotations;

namespace EgyptLawyers.Data.Entities;

public sealed class Court
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Name { get; set; } = null!;

    public int CityId { get; set; }
    public City City { get; set; } = null!;
}

