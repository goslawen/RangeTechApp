using MediatR;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.Commands;

public sealed record CreateWorkTaskCommand(CreateWorkTaskDto WorkTask) : IRequest<WorkTaskDto>;

public sealed record UpdateWorkTaskCommand(Guid Id, UpdateWorkTaskDto WorkTask) : IRequest<WorkTaskDto?>;

public sealed record DeleteWorkTaskCommand(Guid Id) : IRequest<bool>;
