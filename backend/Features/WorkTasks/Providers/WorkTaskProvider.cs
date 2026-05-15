using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Providers;

public interface IWorkTaskProvider : ICrudProvider<WorkTask>
{
}

public sealed class WorkTaskProvider(AppDbContext dbContext) : CrudProvider<WorkTask>(dbContext), IWorkTaskProvider
{
}
