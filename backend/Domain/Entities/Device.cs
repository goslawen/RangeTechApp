using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Domain.Entities;

public sealed class Device : IEntity
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public Client? Client { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public ICollection<WorkTask> WorkTasks { get; set; } = [];
    public ICollection<ServiceTicket> ServiceTickets { get; set; } = [];
}
