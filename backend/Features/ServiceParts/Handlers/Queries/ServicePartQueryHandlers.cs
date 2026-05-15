using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Services;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Handlers.Queries;

public sealed class GetAllServicePartsQueryHandler(IServicePartService service)
    : IRequestHandler<GetAllServicePartsQuery, IReadOnlyList<ServicePartDto>>
{
    public Task<IReadOnlyList<ServicePartDto>> Handle(GetAllServicePartsQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetServicePartByIdQueryHandler(IServicePartService service)
    : IRequestHandler<GetServicePartByIdQuery, ServicePartDto?>
{
    public Task<ServicePartDto?> Handle(GetServicePartByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
