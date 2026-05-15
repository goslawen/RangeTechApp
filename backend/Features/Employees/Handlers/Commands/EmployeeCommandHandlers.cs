using MediatR;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Employees.Services;

namespace RangeTech.ServiceApp.Api.Features.Employees.Handlers.Commands;

public sealed class CreateEmployeeCommandHandler(IEmployeeService service)
    : IRequestHandler<CreateEmployeeCommand, EmployeeDto>
{
    public Task<EmployeeDto> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.Employee, cancellationToken);
    }
}

public sealed class UpdateEmployeeCommandHandler(IEmployeeService service)
    : IRequestHandler<UpdateEmployeeCommand, EmployeeDto?>
{
    public Task<EmployeeDto?> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.Employee, cancellationToken);
    }
}

public sealed class DeleteEmployeeCommandHandler(IEmployeeService service)
    : IRequestHandler<DeleteEmployeeCommand, bool>
{
    public Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
