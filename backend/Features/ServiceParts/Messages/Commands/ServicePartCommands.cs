using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.Commands;

public sealed record CreateServicePartCommand(CreateServicePartDto ServicePart) : IRequest<ServicePartDto>;

public sealed record UpdateServicePartCommand(Guid Id, UpdateServicePartDto ServicePart) : IRequest<ServicePartDto?>;

public sealed record DeleteServicePartCommand(Guid Id) : IRequest<bool>;
