using System;
using System.Collections.Generic;

namespace API.TempModels;

public partial class ActivityTask
{
    public int ActivityId { get; set; }

    public string? ActivityName { get; set; }

    public DateTime WhenStarted { get; set; }

    public DateTime WhenEnded { get; set; }

    public string? Description { get; set; }

    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
