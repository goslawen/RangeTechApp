using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.WorkTasks.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class WorkTasksController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<WorkTaskDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllWorkTasksQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WorkTaskDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var workTask = await mediator.Send(new GetWorkTaskByIdQuery(id), cancellationToken);
        return workTask is null ? NotFound() : Ok(workTask);
    }

    [HttpPost]
    public async Task<ActionResult<WorkTaskDto>> Create(CreateWorkTaskDto workTask, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateWorkTaskCommand(workTask), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<WorkTaskDto>> Update(Guid id, UpdateWorkTaskDto workTask, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateWorkTaskCommand(id, workTask), cancellationToken);
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
        var deleted = await mediator.Send(new DeleteWorkTaskCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
