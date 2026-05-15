using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.Queries;

public sealed record GetAllServiceTicketsQuery : IRequest<IReadOnlyList<ServiceTicketDto>>;

public sealed record GetServiceTicketByIdQuery(Guid Id) : IRequest<ServiceTicketDto?>;
