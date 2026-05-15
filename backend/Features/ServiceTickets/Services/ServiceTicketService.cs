using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Providers;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Services;

public interface IServiceTicketService : ICrudService<ServiceTicketDto, CreateServiceTicketDto, UpdateServiceTicketDto>
{
}

public sealed class ServiceTicketService(IServiceTicketProvider provider, IMapper mapper)
    : CrudService<ServiceTicket, ServiceTicketDto, CreateServiceTicketDto, UpdateServiceTicketDto>(provider, mapper), IServiceTicketService
{
    protected override void ValidateCreate(CreateServiceTicketDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.Title, nameof(dto.Title));
    }

    protected override void ValidateUpdate(UpdateServiceTicketDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.Title, nameof(dto.Title));
    }
}
