using MediatR;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.Queries;

public sealed record GetAllTaskTypesQuery : IRequest<IReadOnlyList<TaskTypeDto>>;

public sealed record GetTaskTypeByIdQuery(Guid Id) : IRequest<TaskTypeDto?>;
