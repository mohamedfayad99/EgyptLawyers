namespace EgyptLawyers.Api.Contracts;

public sealed record CreateCityRequest(string Name);
public sealed record CreateCourtRequest(string Name, int CityId);
public sealed record ResetLawyerPasswordRequest(string NewPassword);

