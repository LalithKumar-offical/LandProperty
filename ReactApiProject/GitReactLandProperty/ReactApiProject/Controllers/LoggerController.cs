using LoanProperty.Manager.Implementation;
using Microsoft.AspNetCore.Http;
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

        // ==================== GET ALL LOGS ====================
        /// <summary>
        /// Get all logs in descending order of date.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllLogs()
        {
            var logs = await _loggerService.GetAllLogsAsync();
            if (logs == null || !logs.Any())
                return NotFound("No logs found.");

            return Ok(logs);
        }

        // ==================== DELETE ALL LOGS ====================
        /// <summary>
        /// Delete all logs from the database.
        /// </summary>
        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAllLogs()
        {
            await _loggerService.DeleteAllLogsAsync();
            return Ok("✅ All logs deleted successfully.");
        }

        // (Optional) ==================== FILTER BY ACTION ====================
        // Example: api/logger/filter?action=AddBid
        [HttpGet("filter")]
        public async Task<IActionResult> FilterLogs([FromQuery] string? action = null)
        {
            var logs = await _loggerService.GetAllLogsAsync();

            if (!string.IsNullOrEmpty(action))
                logs = logs.Where(l => l.Action != null && l.Action.Equals(action, StringComparison.OrdinalIgnoreCase));

            return Ok(logs);
        }
    }
}
