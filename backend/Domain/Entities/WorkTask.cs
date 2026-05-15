using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Domain.Entities;

public sealed class WorkTask : IEntity
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public Guid DeviceId { get; set; }
    public Device? Device { get; set; }
    public Guid TaskTypeId { get; set; }
    public TaskType? TaskType { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "New";
    public DateTime ScheduledAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAtUtc { get; set; }
}
