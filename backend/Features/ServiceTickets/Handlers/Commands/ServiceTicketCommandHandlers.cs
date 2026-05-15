using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Services;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Handlers.Commands;

public sealed class CreateServiceTicketCommandHandler(IServiceTicketService service)
    : IRequestHandler<CreateServiceTicketCommand, ServiceTicketDto>
{
    public Task<ServiceTicketDto> Handle(CreateServiceTicketCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.ServiceTicket, cancellationToken);
    }
}

public sealed class UpdateServiceTicketCommandHandler(IServiceTicketService service)
    : IRequestHandler<UpdateServiceTicketCommand, ServiceTicketDto?>
{
    public Task<ServiceTicketDto?> Handle(UpdateServiceTicketCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.ServiceTicket, cancellationToken);
    }
}

public sealed class DeleteServiceTicketCommandHandler(IServiceTicketService service)
    : IRequestHandler<DeleteServiceTicketCommand, bool>
{
    public Task<bool> Handle(DeleteServiceTicketCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
