using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Services;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Handlers.Queries;

public sealed class GetAllServiceTicketsQueryHandler(IServiceTicketService service)
    : IRequestHandler<GetAllServiceTicketsQuery, IReadOnlyList<ServiceTicketDto>>
{
    public Task<IReadOnlyList<ServiceTicketDto>> Handle(GetAllServiceTicketsQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetServiceTicketByIdQueryHandler(IServiceTicketService service)
    : IRequestHandler<GetServiceTicketByIdQuery, ServiceTicketDto?>
{
    public Task<ServiceTicketDto?> Handle(GetServiceTicketByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
