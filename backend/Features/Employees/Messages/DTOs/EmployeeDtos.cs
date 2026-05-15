namespace RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;

public sealed record EmployeeDto(Guid Id, string FirstName, string LastName, string Email, string Role);

public sealed record CreateEmployeeDto(string FirstName, string LastName, string Email, string Role);

public sealed record UpdateEmployeeDto(string FirstName, string LastName, string Email, string Role);
