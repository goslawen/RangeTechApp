using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Mappings;

public static class ServiceReportMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ServiceReport, ServiceReportDto>()
            .Map(destination => destination.Parts, source => source.ServiceReportParts);
        config.NewConfig<ServiceReportPart, ServiceReportPartDto>();
        config.NewConfig<CreateServiceReportDto, ServiceReport>();
        config.NewConfig<UpdateServiceReportDto, ServiceReport>();
    }
}
