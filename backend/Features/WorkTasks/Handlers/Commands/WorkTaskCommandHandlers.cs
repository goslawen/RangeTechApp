using MediatR;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Services;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Handlers.Commands;

public sealed class CreateWorkTaskCommandHandler(IWorkTaskService service)
    : IRequestHandler<CreateWorkTaskCommand, WorkTaskDto>
{
    public Task<WorkTaskDto> Handle(CreateWorkTaskCommand request, CancellationToken cancellationToken)
    {
        return service.CreateAsync(request.WorkTask, cancellationToken);
    }
}

public sealed class UpdateWorkTaskCommandHandler(IWorkTaskService service)
    : IRequestHandler<UpdateWorkTaskCommand, WorkTaskDto?>
{
    public Task<WorkTaskDto?> Handle(UpdateWorkTaskCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateAsync(request.Id, request.WorkTask, cancellationToken);
    }
}

public sealed class DeleteWorkTaskCommandHandler(IWorkTaskService service) : IRequestHandler<DeleteWorkTaskCommand, bool>
{
    public Task<bool> Handle(DeleteWorkTaskCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteAsync(request.Id, cancellationToken);
    }
}
