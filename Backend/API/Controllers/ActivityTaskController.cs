using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Security.Claims;
using Backend.AppDbContext;
using Backend.Classes;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ActivityTaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityTaskController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ActivityTask
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityTask>>> GetAll()
        {
            var userId = GetUserId();
            var items = await _context.ActivityTasks!
                .Where(a => a.UserId == userId)
                .ToListAsync();
            return Ok(items);
        }

        // GET: api/ActivityTask/today
        [HttpGet("today")]
        public async Task<ActionResult<IEnumerable<ActivityTask>>> GetToday()
        {
            var userId = GetUserId();
            var start = DateTime.SpecifyKind(DateTime.Today, DateTimeKind.Utc);
            var end = DateTime.SpecifyKind(DateTime.Today.AddDays(1), DateTimeKind.Utc);
            var items = await _context.ActivityTasks!
                .Where(a => a.UserId == userId && a.WhenStarted >= start && a.WhenStarted < end)
                .OrderBy(a => a.WhenStarted)
                .ToListAsync();

            return Ok(items);
        }

        // GET: api/ActivityTask/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ActivityTask>> Get(int id)
        {
            var userId = GetUserId();
            var item = await _context.ActivityTasks!
                .FirstOrDefaultAsync(a => a.ActivityId == id && a.UserId == userId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/ActivityTask
        [HttpPost]
        public async Task<ActionResult<ActivityTask>> Create(ActivityTask activityTask)
        {
            var userId = GetUserId();       
            activityTask.UserId = userId;
            activityTask.WhenStarted = EnsureUtc(activityTask.WhenStarted);
            activityTask.WhenEnded = EnsureUtc(activityTask.WhenEnded);

            _context.ActivityTasks!.Add(activityTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = activityTask.ActivityId }, activityTask);
        }

        // PUT: api/ActivityTask/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, ActivityTask activityTask)
        {
            if (id != activityTask.ActivityId) return BadRequest();

            var userId = GetUserId();
            var exists = await _context.ActivityTasks!
                .AsNoTracking()
                .AnyAsync(a => a.ActivityId == id && a.UserId == userId);
            if (!exists) return NotFound();

            activityTask.UserId = userId;
            activityTask.WhenStarted = EnsureUtc(activityTask.WhenStarted);
            activityTask.WhenEnded = EnsureUtc(activityTask.WhenEnded);

            _context.ActivityTasks.Update(activityTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ActivityTask/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var item = await _context.ActivityTasks!
                .FirstOrDefaultAsync(a => a.ActivityId == id && a.UserId == userId);
            if (item == null) return NotFound();

            _context.ActivityTasks.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static DateTime EnsureUtc(DateTime value)
        {
            if (value.Kind == DateTimeKind.Utc) return value;
            if (value.Kind == DateTimeKind.Unspecified)
            {
                return DateTime.SpecifyKind(value, DateTimeKind.Utc);
            }

            return value.ToUniversalTime();
        }

        private int GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            return userId;
        }
    }
}

