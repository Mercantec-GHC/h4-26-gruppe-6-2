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
using Microsoft.AspNetCore.Authorization;

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
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (string.IsNullOrEmpty(registerDto.Password) || string.IsNullOrEmpty(registerDto.Email))
        {
            return BadRequest("Email and password are required.");
        }
        var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(registerDto.Password, 13);
        var user = new User {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash
        };
        _appDbContext.Set<User>().Add(user);
        await _appDbContext.SaveChangesAsync();
        return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
    }

    public class LoginDto {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (ModelState.IsValid && !string.IsNullOrEmpty(loginDto.Email) && !string.IsNullOrEmpty(loginDto.Password))
        {
            var result = await _appDbContext.Set<User>().FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (result != null && BCrypt.Net.BCrypt.EnhancedVerify(loginDto.Password, result.PasswordHash))
            {
                var token = _jwtService.GenerateToken(result);
                Response.Headers.Add("x-access-token", token);
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

    [Authorize]    
    [HttpGet("") ]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _appDbContext.Set<User>().ToListAsync();
        return Ok(users);
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDto updatedUser)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        if (!int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var user = await _appDbContext.Set<User>().FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }


        // Opdater kun felter, der er angivet og ikke "string" (tillad delvise opdateringer)
        if (!string.IsNullOrEmpty(updatedUser.Username) && updatedUser.Username != "string")
            user.Username = updatedUser.Username;
        if (!string.IsNullOrEmpty(updatedUser.Email) && updatedUser.Email != "string")
            user.Email = updatedUser.Email;
        if (!string.IsNullOrEmpty(updatedUser.PasswordHash) && updatedUser.PasswordHash != "string")
            user.PasswordHash = updatedUser.PasswordHash;

        _appDbContext.Set<User>().Update(user);
        await _appDbContext.SaveChangesAsync();

        return Ok(user);
    }

    [Authorize]
    [HttpDelete("delete user")]
    public async Task<IActionResult> DeleteUser()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        if (!int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var user = await _appDbContext.Set<User>().FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        _appDbContext.Set<User>().Remove(user);
        await _appDbContext.SaveChangesAsync();

        return NoContent();
    }
}

