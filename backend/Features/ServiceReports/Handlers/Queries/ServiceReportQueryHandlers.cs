using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Services;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Handlers.Queries;

public sealed class GetAllServiceReportsQueryHandler(IServiceReportService service)
    : IRequestHandler<GetAllServiceReportsQuery, IReadOnlyList<ServiceReportDto>>
{
    public Task<IReadOnlyList<ServiceReportDto>> Handle(GetAllServiceReportsQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetServiceReportByIdQueryHandler(IServiceReportService service)
    : IRequestHandler<GetServiceReportByIdQuery, ServiceReportDto?>
{
    public Task<ServiceReportDto?> Handle(GetServiceReportByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
