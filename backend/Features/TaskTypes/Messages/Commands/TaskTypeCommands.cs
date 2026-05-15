using MediatR;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.Commands;

public sealed record CreateTaskTypeCommand(CreateTaskTypeDto TaskType) : IRequest<TaskTypeDto>;

public sealed record UpdateTaskTypeCommand(Guid Id, UpdateTaskTypeDto TaskType) : IRequest<TaskTypeDto?>;

public sealed record DeleteTaskTypeCommand(Guid Id) : IRequest<bool>;
