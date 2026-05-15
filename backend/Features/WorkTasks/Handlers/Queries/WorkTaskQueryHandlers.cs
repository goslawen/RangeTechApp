using MediatR;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Services;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Handlers.Queries;

public sealed class GetAllWorkTasksQueryHandler(IWorkTaskService service)
    : IRequestHandler<GetAllWorkTasksQuery, IReadOnlyList<WorkTaskDto>>
{
    public Task<IReadOnlyList<WorkTaskDto>> Handle(GetAllWorkTasksQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetWorkTaskByIdQueryHandler(IWorkTaskService service)
    : IRequestHandler<GetWorkTaskByIdQuery, WorkTaskDto?>
{
    public Task<WorkTaskDto?> Handle(GetWorkTaskByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
