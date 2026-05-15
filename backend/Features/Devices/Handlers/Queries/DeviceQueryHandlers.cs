using MediatR;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.Devices.Services;

namespace RangeTech.ServiceApp.Api.Features.Devices.Handlers.Queries;

public sealed class GetAllDevicesQueryHandler(IDeviceService service)
    : IRequestHandler<GetAllDevicesQuery, IReadOnlyList<DeviceDto>>
{
    public Task<IReadOnlyList<DeviceDto>> Handle(GetAllDevicesQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetDeviceByIdQueryHandler(IDeviceService service) : IRequestHandler<GetDeviceByIdQuery, DeviceDto?>
{
    public Task<DeviceDto?> Handle(GetDeviceByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
