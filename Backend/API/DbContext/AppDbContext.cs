using Microsoft.EntityFrameworkCore;
using Backend.Classes;

namespace Backend.DbContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User>? Users { get; set; }
    }
}