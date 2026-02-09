using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
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
            var items = await _context.ActivityTasks!.ToListAsync();
            return Ok(items);
        }

        // GET: api/ActivityTask/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ActivityTask>> Get(int id)
        {
            var item = await _context.ActivityTasks!.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/ActivityTask
        [HttpPost]
        public async Task<ActionResult<ActivityTask>> Create(ActivityTask activityTask)
        {
            _context.ActivityTasks!.Add(activityTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = activityTask.ActivityId }, activityTask);
        }

        // PUT: api/ActivityTask/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, ActivityTask activityTask)
        {
            if (id != activityTask.ActivityId) return BadRequest();

            var exists = await _context.ActivityTasks!.AsNoTracking().AnyAsync(a => a.ActivityId == id);
            if (!exists) return NotFound();

            _context.ActivityTasks.Update(activityTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ActivityTask/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.ActivityTasks!.FindAsync(id);
            if (item == null) return NotFound();

            _context.ActivityTasks.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
