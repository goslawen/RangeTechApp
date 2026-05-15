using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Clients.Mappings;

public static class ClientMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Client, ClientDto>();
        config.NewConfig<CreateClientDto, Client>();
        config.NewConfig<UpdateClientDto, Client>();
    }
}
