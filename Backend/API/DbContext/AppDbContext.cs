using Microsoft.EntityFrameworkCore;
using Backend.Classes;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.AppDbContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User>? Users { get; set; }
        public DbSet<ActivityTask>? ActivityTasks { get; set; }
    }
}