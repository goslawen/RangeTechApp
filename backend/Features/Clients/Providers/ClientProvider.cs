using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.Clients.Providers;

public interface IClientProvider : ICrudProvider<Client>
{
}

public sealed class ClientProvider(AppDbContext dbContext) : CrudProvider<Client>(dbContext), IClientProvider
{
}
