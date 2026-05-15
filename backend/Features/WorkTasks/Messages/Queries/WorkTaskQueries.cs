using MediatR;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.Queries;

public sealed record GetAllWorkTasksQuery : IRequest<IReadOnlyList<WorkTaskDto>>;

public sealed record GetWorkTaskByIdQuery(Guid Id) : IRequest<WorkTaskDto?>;
