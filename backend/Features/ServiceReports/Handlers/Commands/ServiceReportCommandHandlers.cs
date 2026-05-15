using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Services;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Handlers.Commands;

public sealed class CreateServiceReportCommandHandler(IServiceReportService service)
    : IRequestHandler<CreateServiceReportCommand, ServiceReportDto>
{
    public Task<ServiceReportDto> Handle(CreateServiceReportCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.ServiceReport, cancellationToken);
    }
}

public sealed class UpdateServiceReportCommandHandler(IServiceReportService service)
    : IRequestHandler<UpdateServiceReportCommand, ServiceReportDto?>
{
    public Task<ServiceReportDto?> Handle(UpdateServiceReportCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.ServiceReport, cancellationToken);
    }
}

public sealed class DeleteServiceReportCommandHandler(IServiceReportService service)
    : IRequestHandler<DeleteServiceReportCommand, bool>
{
    public Task<bool> Handle(DeleteServiceReportCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}

public sealed class AssignServiceReportPartCommandHandler(IServiceReportService service)
    : IRequestHandler<AssignServiceReportPartCommand, ServiceReportPartDto?>
{
    public Task<ServiceReportPartDto?> Handle(AssignServiceReportPartCommand request, CancellationToken cancellationToken)
    {
        return service.AssignPartAsync(request.ServiceReportId, request.Part, cancellationToken);
    }
}
