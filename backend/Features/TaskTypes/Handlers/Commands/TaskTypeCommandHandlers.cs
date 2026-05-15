using MediatR;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Services;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Handlers.Commands;

public sealed class CreateTaskTypeCommandHandler(ITaskTypeService service)
    : IRequestHandler<CreateTaskTypeCommand, TaskTypeDto>
{
    public Task<TaskTypeDto> Handle(CreateTaskTypeCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.TaskType, cancellationToken);
    }
}

public sealed class UpdateTaskTypeCommandHandler(ITaskTypeService service)
    : IRequestHandler<UpdateTaskTypeCommand, TaskTypeDto?>
{
    public Task<TaskTypeDto?> Handle(UpdateTaskTypeCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.TaskType, cancellationToken);
    }
}

public sealed class DeleteTaskTypeCommandHandler(ITaskTypeService service) : IRequestHandler<DeleteTaskTypeCommand, bool>
{
    public Task<bool> Handle(DeleteTaskTypeCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
