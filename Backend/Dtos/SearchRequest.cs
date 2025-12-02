public class SearchRequest
{
    public string? Query { get; set; }          // text search
    public string? Genre { get; set; }          // Action, Drama, Sci-Fi
    public string? Type { get; set; }           // Movie / Series
    public int? Year { get; set; }              // Year filter
    public double? MinRating { get; set; }      // IMDb rating filter
}
