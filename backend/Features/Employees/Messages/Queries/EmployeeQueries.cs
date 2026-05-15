using MediatR;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Employees.Messages.Queries;

public sealed record GetAllEmployeesQuery : IRequest<IReadOnlyList<EmployeeDto>>;

public sealed record GetEmployeeByIdQuery(Guid Id) : IRequest<EmployeeDto?>;
