using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Employees.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class EmployeesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EmployeeDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllEmployeesQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EmployeeDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var employee = await mediator.Send(new GetEmployeeByIdQuery(id), cancellationToken);
        return employee is null ? NotFound() : Ok(employee);
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> Create(CreateEmployeeDto employee, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateEmployeeCommand(employee), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EmployeeDto>> Update(Guid id, UpdateEmployeeDto employee, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateEmployeeCommand(id, employee), cancellationToken);
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
        var deleted = await mediator.Send(new DeleteEmployeeCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
