using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace API.TempModels;

public partial class NeondbContext : DbContext
{
    public NeondbContext()
    {
    }

    public NeondbContext(DbContextOptions<NeondbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActivityTask> ActivityTasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=ep-crimson-darkness-agmq4r5e-pooler.c-2.eu-central-1.aws.neon.tech; Database=neondb; Username=neondb_owner; Password=npg_F9KpAucLh4lx; SSL Mode=VerifyFull;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ActivityTask>(entity =>
        {
            entity.HasKey(e => e.ActivityId);

            entity.HasIndex(e => e.UserId, "IX_ActivityTasks_UserId");

            entity.Property(e => e.UserId).HasDefaultValue(1);

            entity.HasOne(d => d.User).WithMany(p => p.ActivityTasks).HasForeignKey(d => d.UserId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
