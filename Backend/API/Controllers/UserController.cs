namespace Backend.Controllers;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Backend.AppDbContext;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly AppDbContext _dbContext;


    public UserController(ILogger<UserController> logger, AppDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpPost("create user")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User userLogin)
    {
        if (ModelState.IsValid)
        {
            var result = await _dbContext.Users.FindAsync(userLogin.Id);
            if (result != null && result.PasswordHash == userLogin.PasswordHash)
            {
                
            }
        }
        
        return Unauthorized();
    }
}

