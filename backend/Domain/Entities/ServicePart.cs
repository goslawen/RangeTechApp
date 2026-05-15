using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Domain.Entities;

public sealed class ServicePart : IEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int StockQuantity { get; set; }
    public ICollection<ServiceReportPart> ServiceReportParts { get; set; } = [];
}
