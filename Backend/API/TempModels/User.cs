using System;
using System.Collections.Generic;

namespace API.TempModels;

public partial class User
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public virtual ICollection<ActivityTask> ActivityTasks { get; set; } = new List<ActivityTask>();
}
