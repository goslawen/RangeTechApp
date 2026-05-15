using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Employees.Providers;

namespace RangeTech.ServiceApp.Api.Features.Employees.Services;

public interface IEmployeeService : ICrudService<EmployeeDto, CreateEmployeeDto, UpdateEmployeeDto>
{
}

public sealed class EmployeeService(IEmployeeProvider provider, IMapper mapper)
    : CrudService<Employee, EmployeeDto, CreateEmployeeDto, UpdateEmployeeDto>(provider, mapper), IEmployeeService
{
    protected override void ValidateCreate(CreateEmployeeDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.FirstName, nameof(dto.FirstName));
        RequireText(dto.LastName, nameof(dto.LastName));
        RequireText(dto.Email, nameof(dto.Email));
    }

    protected override void ValidateUpdate(UpdateEmployeeDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.FirstName, nameof(dto.FirstName));
        RequireText(dto.LastName, nameof(dto.LastName));
        RequireText(dto.Email, nameof(dto.Email));
    }
}
