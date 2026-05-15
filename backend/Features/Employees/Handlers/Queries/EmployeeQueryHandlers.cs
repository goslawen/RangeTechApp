using MediatR;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.Employees.Services;

namespace RangeTech.ServiceApp.Api.Features.Employees.Handlers.Queries;

public sealed class GetAllEmployeesQueryHandler(IEmployeeService service)
    : IRequestHandler<GetAllEmployeesQuery, IReadOnlyList<EmployeeDto>>
{
    public Task<IReadOnlyList<EmployeeDto>> Handle(GetAllEmployeesQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetEmployeeByIdQueryHandler(IEmployeeService service)
    : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto?>
{
    public Task<EmployeeDto?> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
