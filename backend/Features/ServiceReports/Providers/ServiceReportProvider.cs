using Microsoft.EntityFrameworkCore;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Providers;

public interface IServiceReportProvider : ICrudProvider<ServiceReport>
{
    Task<ServiceReportPart?> AssignPartAsync(Guid serviceReportId, Guid servicePartId, int quantityUsed, string note, CancellationToken cancellationToken);
}

public sealed class ServiceReportProvider(AppDbContext dbContext) : CrudProvider<ServiceReport>(dbContext), IServiceReportProvider
{
    public override async Task<IReadOnlyList<ServiceReport>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await DbContext.ServiceReports
            .AsNoTracking()
            .Include(report => report.ServiceReportParts)
            .ToListAsync(cancellationToken);
    }

    public override async Task<ServiceReport?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await DbContext.ServiceReports
            .AsNoTracking()
            .Include(report => report.ServiceReportParts)
            .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);
    }

    public async Task<ServiceReportPart?> AssignPartAsync(
        Guid serviceReportId,
        Guid servicePartId,
        int quantityUsed,
        string note,
        CancellationToken cancellationToken)
    {
        var reportExists = await DbContext.ServiceReports.AnyAsync(report => report.Id == serviceReportId, cancellationToken);
        var partExists = await DbContext.ServiceParts.AnyAsync(part => part.Id == servicePartId, cancellationToken);

        if (!reportExists || !partExists)
        {
            return null;
        }

        var reportPart = new ServiceReportPart
        {
            Id = Guid.NewGuid(),
            ServiceReportId = serviceReportId,
            ServicePartId = servicePartId,
            QuantityUsed = quantityUsed,
            Note = note
        };

        DbContext.ServiceReportParts.Add(reportPart);
        await DbContext.SaveChangesAsync(cancellationToken);
        return reportPart;
    }
}
