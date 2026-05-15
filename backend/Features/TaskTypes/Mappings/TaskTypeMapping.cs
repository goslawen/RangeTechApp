using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Mappings;

public static class TaskTypeMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<TaskType, TaskTypeDto>();
        config.NewConfig<CreateTaskTypeDto, TaskType>();
        config.NewConfig<UpdateTaskTypeDto, TaskType>();
    }
}
