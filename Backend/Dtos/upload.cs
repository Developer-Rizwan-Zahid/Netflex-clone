public class ContentUploadDto
{
    public IFormFile File { get; set; }
    public string Title { get; set; }
    public string Genre { get; set; }
    public string Type { get; set; }
    public double Rating { get; set; }
    public string ThumbnailUrl { get; set; }
}
