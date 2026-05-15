using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Devices.Providers;

namespace RangeTech.ServiceApp.Api.Features.Devices.Services;

public interface IDeviceService : ICrudService<DeviceDto, CreateDeviceDto, UpdateDeviceDto>
{
}

public sealed class DeviceService(IDeviceProvider provider, IMapper mapper)
    : CrudService<Device, DeviceDto, CreateDeviceDto, UpdateDeviceDto>(provider, mapper), IDeviceService
{
    private const string DuplicateSerialNumberMessage = "Urządzenie z takim numerem seryjnym już istnieje.";
    private readonly IDeviceProvider _deviceProvider = provider;

    public override async Task<DeviceDto> CreateAsync(CreateDeviceDto dto, CancellationToken cancellationToken)
    {
        ValidateCreate(dto);
        await EnsureUniqueSerialNumberAsync(dto.SerialNumber, null, cancellationToken);
        var entity = Mapper.Map<Device>(dto);
        var created = await Provider.CreateAsync(entity, cancellationToken);
        return Mapper.Map<DeviceDto>(created);
    }

    public override async Task<DeviceDto?> UpdateAsync(Guid id, UpdateDeviceDto dto, CancellationToken cancellationToken)
    {
        ValidateUpdate(dto);
        await EnsureUniqueSerialNumberAsync(dto.SerialNumber, id, cancellationToken);
        var entity = Mapper.Map<Device>(dto);
        var updated = await Provider.UpdateAsync(id, entity, cancellationToken);
        return updated is null ? null : Mapper.Map<DeviceDto>(updated);
    }

    protected override void ValidateCreate(CreateDeviceDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.SerialNumber, nameof(dto.SerialNumber));
        RequireText(dto.Model, nameof(dto.Model));
    }

    protected override void ValidateUpdate(UpdateDeviceDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.SerialNumber, nameof(dto.SerialNumber));
        RequireText(dto.Model, nameof(dto.Model));
    }

    private async Task EnsureUniqueSerialNumberAsync(
        string serialNumber,
        Guid? excludedDeviceId,
        CancellationToken cancellationToken)
    {
        if (await _deviceProvider.SerialNumberExistsAsync(serialNumber, excludedDeviceId, cancellationToken))
        {
            throw new ApiValidationException(DuplicateSerialNumberMessage);
        }
    }
}
