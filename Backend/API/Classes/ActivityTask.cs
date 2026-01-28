using System.ComponentModel.DataAnnotations;

namespace Backend.Classes
{
    public class ActivityTask
    {
        [Key]
        public int ActivityId { get; set; }
        public string? ActivityName { get; set; }
        public DateTime WhenStarted { get; set; }
        public DateTime WhenEnded { get; set; }
    }
}