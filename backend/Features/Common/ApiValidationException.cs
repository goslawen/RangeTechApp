namespace RangeTech.ServiceApp.Api.Features.Common;

public sealed class ApiValidationException(string message) : Exception(message)
{
}
