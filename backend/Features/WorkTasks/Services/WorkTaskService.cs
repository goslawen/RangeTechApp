using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Providers;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Services;

public interface IWorkTaskService : ICrudService<WorkTaskDto, CreateWorkTaskDto, UpdateWorkTaskDto>
{
}

public sealed class WorkTaskService(IWorkTaskProvider provider, IMapper mapper)
    : CrudService<WorkTask, WorkTaskDto, CreateWorkTaskDto, UpdateWorkTaskDto>(provider, mapper), IWorkTaskService
{
    protected override void ValidateCreate(CreateWorkTaskDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.Title, nameof(dto.Title));
    }

    protected override void ValidateUpdate(UpdateWorkTaskDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.Title, nameof(dto.Title));
    }
}
