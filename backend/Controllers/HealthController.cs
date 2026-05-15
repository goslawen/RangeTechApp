using Microsoft.AspNetCore.Mvc;

namespace RangeTech.ServiceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            service = "RangeTech Service App API",
            status = "OK",
            timestampUtc = DateTime.UtcNow
        });
    }
}
