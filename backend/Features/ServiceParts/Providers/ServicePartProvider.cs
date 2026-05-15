using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Providers;

public interface IServicePartProvider : ICrudProvider<ServicePart>
{
}

public sealed class ServicePartProvider(AppDbContext dbContext) : CrudProvider<ServicePart>(dbContext), IServicePartProvider
{
}
