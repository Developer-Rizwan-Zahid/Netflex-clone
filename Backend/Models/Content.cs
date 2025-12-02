public class Content
{
    public Guid Id { get; set; }  // ✅ Guid
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoKey { get; set; } = string.Empty;
    public string HLSPlaylist { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public double Rating { get; set; }
}
