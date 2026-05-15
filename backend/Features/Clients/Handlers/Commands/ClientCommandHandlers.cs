using MediatR;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Clients.Services;

namespace RangeTech.ServiceApp.Api.Features.Clients.Handlers.Commands;

public sealed class CreateClientCommandHandler(IClientService service) : IRequestHandler<CreateClientCommand, ClientDto>
{
    public Task<ClientDto> Handle(CreateClientCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.Client, cancellationToken);
    }
}

public sealed class UpdateClientCommandHandler(IClientService service) : IRequestHandler<UpdateClientCommand, ClientDto?>
{
    public Task<ClientDto?> Handle(UpdateClientCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.Client, cancellationToken);
    }
}

public sealed class DeleteClientCommandHandler(IClientService service) : IRequestHandler<DeleteClientCommand, bool>
{
    public Task<bool> Handle(DeleteClientCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
