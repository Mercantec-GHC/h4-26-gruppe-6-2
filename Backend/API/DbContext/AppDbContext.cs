using Microsoft.EntityFrameworkCore;
using Backend.Classes;
using System.Diagnostics;

namespace Backend.DbContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User>? Users { get; set; }
        public DbSet<ActivityTask>? ActivityTasks { get; set; }
    }
}