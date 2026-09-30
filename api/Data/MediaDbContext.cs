using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class MediaDbContext : DbContext
{
    public MediaDbContext(DbContextOptions<MediaDbContext> options) : base(options)
    {
    }

    public DbSet<MediaItem> MediaItems => Set<MediaItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MediaItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(250);
            entity.Property(e => e.Creator).HasMaxLength(200);
            entity.Property(e => e.Genre).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Type).HasConversion<string>();

            entity.HasData(
                new MediaItem
                {
                    Id = 1,
                    Title = "Inception",
                    Type = MediaType.Movie,
                    Creator = "Christopher Nolan",
                    ReleaseYear = 2010,
                    Genre = "Sci-Fi, Action",
                    Overview = "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
                    Rating = 8.8,
                    Status = "Completed",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new MediaItem
                {
                    Id = 2,
                    Title = "Breaking Bad",
                    Type = MediaType.TVShow,
                    Creator = "Vince Gilligan",
                    ReleaseYear = 2008,
                    Genre = "Crime, Drama",
                    Overview = "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
                    Rating = 9.5,
                    Status = "Completed",
                    CreatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc)
                },
                new MediaItem
                {
                    Id = 3,
                    Title = "Dune",
                    Type = MediaType.Book,
                    Creator = "Frank Herbert",
                    ReleaseYear = 1965,
                    Genre = "Science Fiction",
                    Overview = "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family.",
                    Rating = 9.0,
                    Status = "In Progress",
                    CreatedAt = new DateTime(2026, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new MediaItem
                {
                    Id = 4,
                    Title = "The Dark Side of the Moon",
                    Type = MediaType.Album,
                    Creator = "Pink Floyd",
                    ReleaseYear = 1973,
                    Genre = "Progressive Rock",
                    Overview = "The eighth studio album by English rock band Pink Floyd, exploring themes of conflict, greed, time, and mental illness.",
                    Rating = 9.3,
                    Status = "Completed",
                    CreatedAt = new DateTime(2026, 1, 4, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        });
    }
}
