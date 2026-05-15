using MediatR;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Devices.Services;

namespace RangeTech.ServiceApp.Api.Features.Devices.Handlers.Commands;

public sealed class CreateDeviceCommandHandler(IDeviceService service) : IRequestHandler<CreateDeviceCommand, DeviceDto>
{
    public Task<DeviceDto> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.Device, cancellationToken);
    }
}

public sealed class UpdateDeviceCommandHandler(IDeviceService service) : IRequestHandler<UpdateDeviceCommand, DeviceDto?>
{
    public Task<DeviceDto?> Handle(UpdateDeviceCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.Device, cancellationToken);
    }
}

public sealed class DeleteDeviceCommandHandler(IDeviceService service) : IRequestHandler<DeleteDeviceCommand, bool>
{
    public Task<bool> Handle(DeleteDeviceCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
