using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Providers;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Services;

public interface IServicePartService : ICrudService<ServicePartDto, CreateServicePartDto, UpdateServicePartDto>
{
}

public sealed class ServicePartService(IServicePartProvider provider, IMapper mapper)
    : CrudService<ServicePart, ServicePartDto, CreateServicePartDto, UpdateServicePartDto>(provider, mapper), IServicePartService
{
    protected override void ValidateCreate(CreateServicePartDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.Name, nameof(dto.Name));
        RequireText(dto.Sku, nameof(dto.Sku));
    }

    protected override void ValidateUpdate(UpdateServicePartDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.Name, nameof(dto.Name));
        RequireText(dto.Sku, nameof(dto.Sku));
    }
}
