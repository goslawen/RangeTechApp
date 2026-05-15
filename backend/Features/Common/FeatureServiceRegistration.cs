using RangeTech.ServiceApp.Api.Features.Clients.Providers;
using RangeTech.ServiceApp.Api.Features.Clients.Services;
using RangeTech.ServiceApp.Api.Features.Devices.Providers;
using RangeTech.ServiceApp.Api.Features.Devices.Services;
using RangeTech.ServiceApp.Api.Features.Employees.Providers;
using RangeTech.ServiceApp.Api.Features.Employees.Services;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Providers;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Services;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Providers;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Services;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Providers;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Services;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Providers;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Services;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Providers;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Services;

namespace RangeTech.ServiceApp.Api.Features.Common;

public static class FeatureServiceRegistration
{
    public static IServiceCollection AddFeatureServices(this IServiceCollection services)
    {
        services.AddScoped<IEmployeeProvider, EmployeeProvider>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IClientProvider, ClientProvider>();
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IDeviceProvider, DeviceProvider>();
        services.AddScoped<IDeviceService, DeviceService>();
        services.AddScoped<ITaskTypeProvider, TaskTypeProvider>();
        services.AddScoped<ITaskTypeService, TaskTypeService>();
        services.AddScoped<IWorkTaskProvider, WorkTaskProvider>();
        services.AddScoped<IWorkTaskService, WorkTaskService>();
        services.AddScoped<IServiceTicketProvider, ServiceTicketProvider>();
        services.AddScoped<IServiceTicketService, ServiceTicketService>();
        services.AddScoped<IServiceReportProvider, ServiceReportProvider>();
        services.AddScoped<IServiceReportService, ServiceReportService>();
        services.AddScoped<IServicePartProvider, ServicePartProvider>();
        services.AddScoped<IServicePartService, ServicePartService>();

        return services;
    }
}
