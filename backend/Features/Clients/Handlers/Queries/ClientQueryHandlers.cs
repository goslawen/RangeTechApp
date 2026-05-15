using MediatR;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.Clients.Services;

namespace RangeTech.ServiceApp.Api.Features.Clients.Handlers.Queries;

public sealed class GetAllClientsQueryHandler(IClientService service)
    : IRequestHandler<GetAllClientsQuery, IReadOnlyList<ClientDto>>
{
    public Task<IReadOnlyList<ClientDto>> Handle(GetAllClientsQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetClientByIdQueryHandler(IClientService service) : IRequestHandler<GetClientByIdQuery, ClientDto?>
{
    public Task<ClientDto?> Handle(GetClientByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
