using System.Text.Json.Serialization;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        const string DevCorsPolicy = "DevCorsPolicy";

        // Add services to the container.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(DevCorsPolicy, policy =>
            {
                policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        builder.Services.AddDbContext<MediaDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddAuthorization();

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Ensure SQLite database and seed data are created
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MediaDbContext>();
            db.Database.EnsureCreated();
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseCors(DevCorsPolicy);

        app.UseAuthorization();

        // ----------------------------------------------------------------------
        // Media Endpoints
        // ----------------------------------------------------------------------
        var mediaGroup = app.MapGroup("/api/media").WithTags("Media");

        mediaGroup.MapGet("/", async (string? search, MediaType? type, string? status, MediaDbContext db) =>
        {
            var query = db.MediaItems.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(m => m.Title.ToLower().Contains(term) ||
                                         (m.Creator != null && m.Creator.ToLower().Contains(term)) ||
                                         (m.Genre != null && m.Genre.ToLower().Contains(term)));
            }

            if (type.HasValue)
            {
                query = query.Where(m => m.Type == type.Value);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(m => m.Status.ToLower() == status.Trim().ToLower());
            }

            var items = await query.OrderByDescending(m => m.CreatedAt).ToListAsync();
            return Results.Ok(items);
        })
        .WithName("GetMediaItems");

        mediaGroup.MapGet("/{id:int}", async (int id, MediaDbContext db) =>
        {
            var item = await db.MediaItems.FindAsync(id);
            return item is not null ? Results.Ok(item) : Results.NotFound();
        })
        .WithName("GetMediaItemById");

        mediaGroup.MapPost("/", async (MediaItem item, MediaDbContext db) =>
        {
            item.CreatedAt = DateTime.UtcNow;
            db.MediaItems.Add(item);
            await db.SaveChangesAsync();
            return Results.Created($"/api/media/{item.Id}", item);
        })
        .WithName("CreateMediaItem");

        mediaGroup.MapPut("/{id:int}", async (int id, MediaItem updated, MediaDbContext db) =>
        {
            var existing = await db.MediaItems.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Title = updated.Title;
            existing.Type = updated.Type;
            existing.Creator = updated.Creator;
            existing.ReleaseYear = updated.ReleaseYear;
            existing.Genre = updated.Genre;
            existing.Overview = updated.Overview;
            existing.PosterUrl = updated.PosterUrl;
            existing.Rating = updated.Rating;
            existing.Status = updated.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(existing);
        })
        .WithName("UpdateMediaItem");

        mediaGroup.MapDelete("/{id:int}", async (int id, MediaDbContext db) =>
        {
            var item = await db.MediaItems.FindAsync(id);
            if (item is null)
            {
                return Results.NotFound();
            }

            db.MediaItems.Remove(item);
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteMediaItem");

        // ----------------------------------------------------------------------
        // Weather Sample (Default template endpoint)
        // ----------------------------------------------------------------------
        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        app.MapGet("/weatherforecast", () =>
        {
            var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = summaries[Random.Shared.Next(summaries.Length)]
                })
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast");

        app.Run();
    }
}
