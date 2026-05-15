using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.TaskTypes.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TaskTypesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TaskTypeDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllTaskTypesQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskTypeDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var taskType = await mediator.Send(new GetTaskTypeByIdQuery(id), cancellationToken);
        return taskType is null ? NotFound() : Ok(taskType);
    }

    [HttpPost]
    public async Task<ActionResult<TaskTypeDto>> Create(CreateTaskTypeDto taskType, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateTaskTypeCommand(taskType), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskTypeDto>> Update(Guid id, UpdateTaskTypeDto taskType, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateTaskTypeCommand(id, taskType), cancellationToken);
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
        var deleted = await mediator.Send(new DeleteTaskTypeCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
