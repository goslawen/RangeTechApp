using MediatR;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Clients.Messages.Commands;

public sealed record CreateClientCommand(CreateClientDto Client) : IRequest<ClientDto>;

public sealed record UpdateClientCommand(Guid Id, UpdateClientDto Client) : IRequest<ClientDto?>;

public sealed record DeleteClientCommand(Guid Id) : IRequest<bool>;
