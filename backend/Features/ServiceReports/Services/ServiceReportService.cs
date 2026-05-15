using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Entities;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Providers;

namespace RangeTech.ServiceApp.Api.Features.ServiceReports.Services;

public interface IServiceReportService : ICrudService<ServiceReportDto, CreateServiceReportDto, UpdateServiceReportDto>
{
    Task<ServiceReportPartDto?> AssignPartAsync(Guid serviceReportId, AssignServiceReportPartDto dto, CancellationToken cancellationToken);
}

public sealed class ServiceReportService(IServiceReportProvider provider, IMapper mapper)
    : CrudService<ServiceReport, ServiceReportDto, CreateServiceReportDto, UpdateServiceReportDto>(provider, mapper), IServiceReportService
{
    private readonly IServiceReportProvider _serviceReportProvider = provider;

    public async Task<ServiceReportPartDto?> AssignPartAsync(
        Guid serviceReportId,
        AssignServiceReportPartDto dto,
        CancellationToken cancellationToken)
    {
        if (dto.QuantityUsed <= 0)
        {
            throw new ApiValidationException("QuantityUsed must be greater than 0.");
        }

        var reportPart = await _serviceReportProvider.AssignPartAsync(
            serviceReportId,
            dto.ServicePartId,
            dto.QuantityUsed,
            dto.Note,
            cancellationToken);

        return reportPart is null ? null : Mapper.Map<ServiceReportPartDto>(reportPart);
    }

    protected override void ValidateCreate(CreateServiceReportDto dto)
    {
        base.ValidateCreate(dto);
        RequireText(dto.Summary, nameof(dto.Summary));
    }

    protected override void ValidateUpdate(UpdateServiceReportDto dto)
    {
        base.ValidateUpdate(dto);
        RequireText(dto.Summary, nameof(dto.Summary));
    }
}
