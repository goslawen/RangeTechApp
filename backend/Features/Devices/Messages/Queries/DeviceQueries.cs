using MediatR;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Devices.Messages.Queries;

public sealed record GetAllDevicesQuery : IRequest<IReadOnlyList<DeviceDto>>;

public sealed record GetDeviceByIdQuery(Guid Id) : IRequest<DeviceDto?>;
