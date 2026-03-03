namespace EgyptLawyers.Api.Contracts;

public sealed record RegisterLawyerRequest(
    string FullName,
    string? ProfessionalTitle,
    string SyndicateCardNumber,
    string WhatsappNumber,
    string Password,
    int[] ActiveCityIds
);

public sealed record LawyerLoginRequest(string WhatsappNumber, string Password);

public sealed record AdminLoginRequest(string Email, string Password);

