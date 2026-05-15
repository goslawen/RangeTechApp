using Mapster;
using RangeTech.ServiceApp.Api.Features.Clients.Mappings;
using RangeTech.ServiceApp.Api.Features.Devices.Mappings;
using RangeTech.ServiceApp.Api.Features.Employees.Mappings;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Mappings;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Mappings;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Mappings;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Mappings;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Mappings;

namespace RangeTech.ServiceApp.Api.Features.Common;

public static class FeatureMappingConfig
{
    public static void RegisterMappings(TypeAdapterConfig config)
    {
        EmployeeMapping.Register(config);
        ClientMapping.Register(config);
        DeviceMapping.Register(config);
        TaskTypeMapping.Register(config);
        WorkTaskMapping.Register(config);
        ServiceTicketMapping.Register(config);
        ServiceReportMapping.Register(config);
        ServicePartMapping.Register(config);
    }
}
