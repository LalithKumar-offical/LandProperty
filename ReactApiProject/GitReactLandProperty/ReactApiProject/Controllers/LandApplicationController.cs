using LandProperty.Contract.DTO;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LandApplicationController : ControllerBase
    {
        private readonly ILandApplication _service;

        public LandApplicationController(ILandApplication service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] CreateUserLandApplicationDto dto)
        {
            await _service.AddApplicationAsync(dto);
            return Ok("Application submitted successfully");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var app = await _service.GetApplicationByIdAsync(id);
            return app == null ? NotFound() : Ok(app);
        }
}
}
