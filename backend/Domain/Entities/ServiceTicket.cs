using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Domain.Entities;

public sealed class ServiceTicket : IEntity
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public Client? Client { get; set; }
    public Guid DeviceId { get; set; }
    public Device? Device { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "New";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAtUtc { get; set; }
    public ICollection<ServiceReport> ServiceReports { get; set; } = [];
}
