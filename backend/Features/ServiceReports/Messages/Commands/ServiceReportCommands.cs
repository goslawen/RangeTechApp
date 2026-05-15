using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.Commands;

public sealed record CreateServiceReportCommand(CreateServiceReportDto ServiceReport) : IRequest<ServiceReportDto>;

public sealed record UpdateServiceReportCommand(Guid Id, UpdateServiceReportDto ServiceReport) : IRequest<ServiceReportDto?>;

public sealed record DeleteServiceReportCommand(Guid Id) : IRequest<bool>;

public sealed record AssignServiceReportPartCommand(Guid ServiceReportId, AssignServiceReportPartDto Part) : IRequest<ServiceReportPartDto?>;
