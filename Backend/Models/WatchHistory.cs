namespace Backend.Models
{
    public class WatchHistory
    {
        public Guid Id { get; set; }
        public Guid ProfileId { get; set; }
        public UserProfile Profile { get; set; }

        public Guid ContentId { get; set; }
        public Content Content { get; set; }

        public DateTime WatchedAt { get; set; } = DateTime.UtcNow;
    }
}
