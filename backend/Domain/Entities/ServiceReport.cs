using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Domain.Entities;

public sealed class ServiceReport : IEntity
{
    public Guid Id { get; set; }
    public Guid ServiceTicketId { get; set; }
    public ServiceTicket? ServiceTicket { get; set; }
    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public string Summary { get; set; } = string.Empty;
    public DateTime PerformedAtUtc { get; set; } = DateTime.UtcNow;
    public ICollection<ServiceReportPart> ServiceReportParts { get; set; } = [];
}
