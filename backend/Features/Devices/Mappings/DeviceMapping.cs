using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Devices.Mappings;

public static class DeviceMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Device, DeviceDto>();
        config.NewConfig<CreateDeviceDto, Device>();
        config.NewConfig<UpdateDeviceDto, Device>();
    }
}
