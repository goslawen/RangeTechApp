using MediatR;
using Microsoft.AspNetCore.Mvc;
using RangeTech.ServiceApp.Api.Features.Common;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.Commands;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.DTOs;
using RangeTech.ServiceApp.Api.Features.Devices.Messages.Queries;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DevicesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DeviceDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllDevicesQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DeviceDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var device = await mediator.Send(new GetDeviceByIdQuery(id), cancellationToken);
        return device is null ? NotFound() : Ok(device);
    }

    [HttpPost]
    public async Task<ActionResult<DeviceDto>> Create(CreateDeviceDto device, CancellationToken cancellationToken)
    {
        try
        {
            var created = await mediator.Send(new CreateDeviceCommand(device), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ApiValidationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<DeviceDto>> Update(Guid id, UpdateDeviceDto device, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await mediator.Send(new UpdateDeviceCommand(id, device), cancellationToken);
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
        var deleted = await mediator.Send(new DeleteDeviceCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
