using LandProperty.Contract.DTO;
using LoanProperty.Manager.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LandProperty.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeApplicationController : ControllerBase
    {
        private readonly IHomeApplication _service;

        public HomeApplicationController(IHomeApplication service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,PropertyOwner,User")]

        public async Task<IActionResult> Apply([FromBody] CreateUserHomeApplicationDto dto)
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
