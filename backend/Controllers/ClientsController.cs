using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Clients.Messages.Queries;
using RangeTech.ServiceApp.Api.Features.Common;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ClientsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClientDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllClientsQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ClientDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var client = await mediator.Send(new GetClientByIdQuery(id), cancellationToken);
        return client is null ? NotFound() : Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<ClientDto>> Create(CreateClientDto client, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateClientCommand(client), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ClientDto>> Update(Guid id, UpdateClientDto client, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateClientCommand(id, client), cancellationToken);
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
        var deleted = await mediator.Send(new DeleteClientCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
