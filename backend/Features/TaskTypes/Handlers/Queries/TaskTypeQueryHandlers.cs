using MediatR;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Services;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Handlers.Queries;

public sealed class GetAllTaskTypesQueryHandler(ITaskTypeService service)
    : IRequestHandler<GetAllTaskTypesQuery, IReadOnlyList<TaskTypeDto>>
{
    public Task<IReadOnlyList<TaskTypeDto>> Handle(GetAllTaskTypesQuery request, CancellationToken cancellationToken)
    {
        return service.GetAllAsync(cancellationToken);
    }
}

public sealed class GetTaskTypeByIdQueryHandler(ITaskTypeService service)
    : IRequestHandler<GetTaskTypeByIdQuery, TaskTypeDto?>
{
    public Task<TaskTypeDto?> Handle(GetTaskTypeByIdQuery request, CancellationToken cancellationToken)
    {
        return service.GetByIdAsync(request.Id, cancellationToken);
    }
}
