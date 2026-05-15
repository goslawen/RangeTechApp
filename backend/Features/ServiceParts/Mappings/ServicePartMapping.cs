using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Mappings;

public static class ServicePartMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ServicePart, ServicePartDto>();
        config.NewConfig<CreateServicePartDto, ServicePart>();
        config.NewConfig<UpdateServicePartDto, ServicePart>();
    }
}
