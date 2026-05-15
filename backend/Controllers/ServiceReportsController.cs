using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceReports.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ServiceReportsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceReportDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllServiceReportsQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceReportDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var report = await mediator.Send(new GetServiceReportByIdQuery(id), cancellationToken);
        return report is null ? NotFound() : Ok(report);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceReportDto>> Create(CreateServiceReportDto report, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateServiceReportCommand(report), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceReportDto>> Update(Guid id, UpdateServiceReportDto report, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateServiceReportCommand(id, report), cancellationToken);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPost("{id:guid}/parts")]
    public async Task<ActionResult<ServiceReportPartDto>> AssignPart(
        Guid id,
        AssignServiceReportPartDto part,
        CancellationToken cancellationToken)
    {
        try
        {
            var assigned = await mediator.Send(new AssignServiceReportPartCommand(id, part), cancellationToken);
            return assigned is null ? NotFound() : CreatedAtAction(nameof(GetById), new { id }, assigned);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteServiceReportCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
