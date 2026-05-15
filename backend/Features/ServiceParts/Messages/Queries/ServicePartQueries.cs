using MediatR;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.Queries;

public sealed record GetAllServicePartsQuery : IRequest<IReadOnlyList<ServicePartDto>>;

public sealed record GetServicePartByIdQuery(Guid Id) : IRequest<ServicePartDto?>;
