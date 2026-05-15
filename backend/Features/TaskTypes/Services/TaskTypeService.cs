using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Providers;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Services;

public interface ITaskTypeService : ICrudService<TaskTypeDto, CreateTaskTypeDto, UpdateTaskTypeDto>
{
}

public sealed class TaskTypeService(ITaskTypeProvider provider, IMapper mapper)
    : CrudService<TaskType, TaskTypeDto, CreateTaskTypeDto, UpdateTaskTypeDto>(provider, mapper), ITaskTypeService
{
    protected override void ValidateCreate(CreateTaskTypeDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.Name, nameof(dto.Name));
    }

    protected override void ValidateUpdate(UpdateTaskTypeDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.Name, nameof(dto.Name));
    }
}
