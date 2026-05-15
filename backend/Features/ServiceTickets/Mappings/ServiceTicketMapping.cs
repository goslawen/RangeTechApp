using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Mappings;

public static class ServiceTicketMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ServiceTicket, ServiceTicketDto>();
        config.NewConfig<CreateServiceTicketDto, ServiceTicket>();
        config.NewConfig<UpdateServiceTicketDto, ServiceTicket>();
    }
}
