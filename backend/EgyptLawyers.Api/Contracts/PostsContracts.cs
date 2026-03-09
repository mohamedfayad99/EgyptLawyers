namespace EgyptLawyers.Api.Contracts;

public sealed record CreateHelpPostRequest(int CourtId, string Description);

public sealed record CreateHelpPostReplyRequest(string Message);

public sealed record RateReplyRequest(int Rating);

