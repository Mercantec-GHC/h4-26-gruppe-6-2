namespace Backend.Controllers;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Backend.AppDbContext;
using global::API.Services;
using Backend.API.Classes;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly AppDbContext _appDbContext;
    private readonly JwtService _jwtService;


    public UserController(ILogger<UserController> logger, AppDbContext appDbContext, JwtService jwtService)
    {
        _logger = logger;
        _appDbContext = appDbContext;
        _jwtService = jwtService;
    }

    [HttpPost("create user")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        _appDbContext.Set<User>().Add(user);
        await _appDbContext.SaveChangesAsync();
        return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
    }

    public class LoginDto {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (ModelState.IsValid && !string.IsNullOrEmpty(loginDto.Email) && !string.IsNullOrEmpty(loginDto.PasswordHash))
        {
            var result = await _appDbContext.Set<User>().FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (result != null && result.PasswordHash == loginDto.PasswordHash)
            {
                var token = _jwtService.GenerateToken(result);
                return Ok(new {
                    message = "Login godkendt!",
                    token = token,
                    user = new {
                        id = result.Id,
                        email = result.Email,
                        username = result.Username,
                    }
                });
            }
        }
        return Unauthorized();
    }
}

