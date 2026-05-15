using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Clients.Providers;
using RangeTech.ServiceApp.Api.Features.Common;

namespace RangeTech.ServiceApp.Api.Features.Clients.Services;

public interface IClientService : ICrudService<ClientDto, CreateClientDto, UpdateClientDto>
{
}

public sealed class ClientService(IClientProvider provider, IMapper mapper)
    : CrudService<Client, ClientDto, CreateClientDto, UpdateClientDto>(provider, mapper), IClientService
{
    protected override void ValidateCreate(CreateClientDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.Name, nameof(dto.Name));
    }

    protected override void ValidateUpdate(UpdateClientDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.Name, nameof(dto.Name));
    }
}
