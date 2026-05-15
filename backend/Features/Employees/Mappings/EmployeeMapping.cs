using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Employees.Mappings;

public static class EmployeeMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Employee, EmployeeDto>();
        config.NewConfig<CreateEmployeeDto, Employee>();
        config.NewConfig<UpdateEmployeeDto, Employee>();
    }
}
