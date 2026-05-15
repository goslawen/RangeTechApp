using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ServicePartsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServicePartDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllServicePartsQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServicePartDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var part = await mediator.Send(new GetServicePartByIdQuery(id), cancellationToken);
        return part is null ? NotFound() : Ok(part);
    }

    [HttpPost]
    public async Task<ActionResult<ServicePartDto>> Create(CreateServicePartDto part, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateServicePartCommand(part), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServicePartDto>> Update(Guid id, UpdateServicePartDto part, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateServicePartCommand(id, part), cancellationToken);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteServicePartCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
