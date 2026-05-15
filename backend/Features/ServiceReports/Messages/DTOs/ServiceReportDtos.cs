namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;

public sealed record ServiceReportPartDto(
    Guid Id,
    Guid ServiceReportId,
    Guid ServicePartId,
    int QuantityUsed,
    string Note);

public sealed record AssignServiceReportPartDto(Guid ServicePartId, int QuantityUsed, string Note);

public sealed record ServiceReportDto(
    Guid Id,
    Guid ServiceTicketId,
    Guid EmployeeId,
    string Summary,
    DateTime PerformedAtUtc,
    IReadOnlyList<ServiceReportPartDto> Parts);

public sealed record CreateServiceReportDto(Guid ServiceTicketId, Guid EmployeeId, string Summary, DateTime PerformedAtUtc);

public sealed record UpdateServiceReportDto(Guid ServiceTicketId, Guid EmployeeId, string Summary, DateTime PerformedAtUtc);
