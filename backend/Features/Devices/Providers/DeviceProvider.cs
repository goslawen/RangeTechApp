using Microsoft.EntityFrameworkCore;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.Devices.Providers;

public interface IDeviceProvider : ICrudProvider<Device>
{
    Task<bool> SerialNumberExistsAsync(
        string serialNumber,
        Guid? excludedDeviceId,
        CancellationToken cancellationToken);
}

public sealed class DeviceProvider(AppDbContext dbContext) : CrudProvider<Device>(dbContext), IDeviceProvider
{
    public Task<bool> SerialNumberExistsAsync(
        string serialNumber,
        Guid? excludedDeviceId,
        CancellationToken cancellationToken)
    {
        var normalizedSerialNumber = serialNumber.Trim().ToLower();

        return DbContext.Devices
            .AsNoTracking()
            .AnyAsync(
                device =>
                    device.SerialNumber.Trim().ToLower() == normalizedSerialNumber
                    && (!excludedDeviceId.HasValue || device.Id != excludedDeviceId.Value),
                cancellationToken);
    }
}
