namespace RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;

public sealed record TaskTypeDto(Guid Id, string Name, string Description);

public sealed record CreateTaskTypeDto(string Name, string Description);

public sealed record UpdateTaskTypeDto(string Name, string Description);
