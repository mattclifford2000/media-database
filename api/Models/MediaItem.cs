namespace api.Models;

public class MediaItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public MediaType Type { get; set; } = MediaType.Movie;
    public string? Creator { get; set; }
    public int? ReleaseYear { get; set; }
    public string? Genre { get; set; }
    public string? Overview { get; set; }
    public string? PosterUrl { get; set; }
    public double? Rating { get; set; }
    public string Status { get; set; } = "Plan to Watch";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
