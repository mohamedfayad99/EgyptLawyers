namespace EgyptLawyers.Data.Entities;

public sealed class LawyerCity
{
    public Guid LawyerId { get; set; }
    public Lawyer Lawyer { get; set; } = null!;

    public int CityId { get; set; }
    public City City { get; set; } = null!;
}

