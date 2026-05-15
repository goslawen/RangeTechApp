using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.ServiceTickets.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ServiceTicketsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceTicketDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllServiceTicketsQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceTicketDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var ticket = await mediator.Send(new GetServiceTicketByIdQuery(id), cancellationToken);
        return ticket is null ? NotFound() : Ok(ticket);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceTicketDto>> Create(CreateServiceTicketDto ticket, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateServiceTicketCommand(ticket), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceTicketDto>> Update(Guid id, UpdateServiceTicketDto ticket, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateServiceTicketCommand(id, ticket), cancellationToken);
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
        var deleted = await mediator.Send(new DeleteServiceTicketCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
