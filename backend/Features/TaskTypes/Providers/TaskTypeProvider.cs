using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Providers;

public interface ITaskTypeProvider : ICrudProvider<TaskType>
{
}

public sealed class TaskTypeProvider(AppDbContext dbContext) : CrudProvider<TaskType>(dbContext), ITaskTypeProvider
{
}
