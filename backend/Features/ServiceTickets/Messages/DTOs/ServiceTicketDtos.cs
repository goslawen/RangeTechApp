namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;

public sealed record ServiceTicketDto(
    Guid Id,
    Guid ClientId,
    Guid DeviceId,
    string Title,
    string Description,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? ClosedAtUtc);

public sealed record CreateServiceTicketDto(
    Guid ClientId,
    Guid DeviceId,
    string Title,
    string Description,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? ClosedAtUtc);

public sealed record UpdateServiceTicketDto(
    Guid ClientId,
    Guid DeviceId,
    string Title,
    string Description,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? ClosedAtUtc);
