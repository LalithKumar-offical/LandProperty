using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoggerController : ControllerBase
    {
        private readonly LoanProperty.Manager.IService.ILogger _loggerService;

        public LoggerController(LoanProperty.Manager.IService.ILogger loggerService)
        {
            _loggerService = loggerService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllLogs()
        {
            var logs = await _loggerService.GetAllLogsAsync();
            if (logs == null || !logs.Any())
                return NotFound("No logs found.");

            return Ok(logs);
        }

        [HttpDelete("delete-all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAllLogs()
        {
            await _loggerService.DeleteAllLogsAsync();
            return Ok("✅ All logs deleted successfully.");
        }

        [HttpGet("filter")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> FilterLogs([FromQuery] string? action = null)
        {
            var logs = await _loggerService.GetAllLogsAsync();

            if (!string.IsNullOrEmpty(action))
                logs = logs.Where(l => l.Action != null && l.Action.Equals(action, StringComparison.OrdinalIgnoreCase));

            return Ok(logs);
        }
    }
}