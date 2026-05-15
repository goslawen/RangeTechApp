namespace RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;

public sealed record WorkTaskDto(
    Guid Id,
    Guid EmployeeId,
    Guid DeviceId,
    Guid TaskTypeId,
    string Title,
    string Description,
    string Status,
    DateTime ScheduledAtUtc,
    DateTime? CompletedAtUtc);

public sealed record CreateWorkTaskDto(
    Guid EmployeeId,
    Guid DeviceId,
    Guid TaskTypeId,
    string Title,
    string Description,
    string Status,
    DateTime ScheduledAtUtc,
    DateTime? CompletedAtUtc);

public sealed record UpdateWorkTaskDto(
    Guid EmployeeId,
    Guid DeviceId,
    Guid TaskTypeId,
    string Title,
    string Description,
    string Status,
    DateTime ScheduledAtUtc,
    DateTime? CompletedAtUtc);
