namespace RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;

public sealed record DeviceDto(Guid Id, Guid ClientId, string SerialNumber, string Manufacturer, string Model, string Status);

public sealed record CreateDeviceDto(Guid ClientId, string SerialNumber, string Manufacturer, string Model, string Status);

public sealed record UpdateDeviceDto(Guid ClientId, string SerialNumber, string Manufacturer, string Model, string Status);
