using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.Queries;

public sealed record GetAllServiceReportsQuery : IRequest<IReadOnlyList<ServiceReportDto>>;

public sealed record GetServiceReportByIdQuery(Guid Id) : IRequest<ServiceReportDto?>;
