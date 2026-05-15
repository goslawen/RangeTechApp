using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Providers;

public interface IServiceTicketProvider : ICrudProvider<ServiceTicket>
{
}

public sealed class ServiceTicketProvider(AppDbContext dbContext) : CrudProvider<ServiceTicket>(dbContext), IServiceTicketProvider
{
}
