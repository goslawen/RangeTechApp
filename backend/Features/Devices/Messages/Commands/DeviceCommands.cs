using MediatR;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Devices.Messages.Commands;

public sealed record CreateDeviceCommand(CreateDeviceDto Device) : IRequest<DeviceDto>;

public sealed record UpdateDeviceCommand(Guid Id, UpdateDeviceDto Device) : IRequest<DeviceDto?>;

public sealed record DeleteDeviceCommand(Guid Id) : IRequest<bool>;
