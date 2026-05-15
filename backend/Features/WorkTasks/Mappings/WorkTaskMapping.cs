using Mapster;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;

namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Mappings;

public static class WorkTaskMapping
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<WorkTask, WorkTaskDto>();
        config.NewConfig<CreateWorkTaskDto, WorkTask>();
        config.NewConfig<UpdateWorkTaskDto, WorkTask>();
    }
}
