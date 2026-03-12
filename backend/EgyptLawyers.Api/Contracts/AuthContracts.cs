using EgyptLawyers.Data.Entities;

namespace EgyptLawyers.Api.Contracts;

public sealed record RegisterLawyerRequest(
    string FullName,
    string? ProfessionalTitle,
    string SyndicateCardNumber,
    string? NationalIdNumber,
    string WhatsappNumber,
    string Password,
    int[] ActiveCityIds,
    string? ProfileImageBase64,
    string? IdCardImageBase64
);

public sealed record UpdateLawyerProfileRequest(
    string FullName,
    string? ProfessionalTitle,
    string? SyndicateCardNumber,
    string? NationalIdNumber,
    string WhatsappNumber,
    int[] ActiveCityIds,
    string? ProfileImageBase64,
    string? IdCardImageBase64
);

public sealed record LawyerLoginRequest(string WhatsappNumber, string Password);

public sealed record AdminLoginRequest(string Email, string Password);

public sealed record RegisterDeviceRequest(string DeviceToken, DevicePlatform? Platform);

