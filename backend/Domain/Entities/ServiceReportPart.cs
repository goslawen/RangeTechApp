using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Domain.Entities;

public sealed class ServiceReportPart : IEntity
{
    public Guid Id { get; set; }
    public Guid ServiceReportId { get; set; }
    public ServiceReport? ServiceReport { get; set; }
    public Guid ServicePartId { get; set; }
    public ServicePart? ServicePart { get; set; }
    public int QuantityUsed { get; set; }
    public string Note { get; set; } = string.Empty;
}
