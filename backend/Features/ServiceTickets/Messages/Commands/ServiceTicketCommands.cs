using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.Commands;

public sealed record CreateServiceTicketCommand(CreateServiceTicketDto ServiceTicket) : IRequest<ServiceTicketDto>;

public sealed record UpdateServiceTicketCommand(Guid Id, UpdateServiceTicketDto ServiceTicket) : IRequest<ServiceTicketDto?>;

public sealed record DeleteServiceTicketCommand(Guid Id) : IRequest<bool>;
