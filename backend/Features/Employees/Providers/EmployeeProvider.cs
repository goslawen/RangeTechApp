using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.Employees.Providers;

public interface IEmployeeProvider : ICrudProvider<Employee>
{
}

public sealed class EmployeeProvider(AppDbContext dbContext) : CrudProvider<Employee>(dbContext), IEmployeeProvider
{
}
