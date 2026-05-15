using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Services;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Handlers.Commands;

public sealed class CreateServicePartCommandHandler(IServicePartService service)
    : IRequestHandler<CreateServicePartCommand, ServicePartDto>
{
    public Task<ServicePartDto> Handle(CreateServicePartCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.ServicePart, cancellationToken);
    }
}

public sealed class UpdateServicePartCommandHandler(IServicePartService service)
    : IRequestHandler<UpdateServicePartCommand, ServicePartDto?>
{
    public Task<ServicePartDto?> Handle(UpdateServicePartCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.ServicePart, cancellationToken);
    }
}

public sealed class DeleteServicePartCommandHandler(IServicePartService service)
    : IRequestHandler<DeleteServicePartCommand, bool>
{
    public Task<bool> Handle(DeleteServicePartCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
