using MediatR;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Employees.Messages.Commands;

public sealed record CreateEmployeeCommand(CreateEmployeeDto Employee) : IRequest<EmployeeDto>;

public sealed record UpdateEmployeeCommand(Guid Id, UpdateEmployeeDto Employee) : IRequest<EmployeeDto?>;

public sealed record DeleteEmployeeCommand(Guid Id) : IRequest<bool>;
