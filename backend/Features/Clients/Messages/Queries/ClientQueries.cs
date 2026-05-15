using MediatR;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.Clients.Messages.Queries;

public sealed record GetAllClientsQuery : IRequest<IReadOnlyList<ClientDto>>;

public sealed record GetClientByIdQuery(Guid Id) : IRequest<ClientDto?>;
