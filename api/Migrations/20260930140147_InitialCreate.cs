using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MediaItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    ReleaseYear = table.Column<int>(type: "INTEGER", nullable: true),
                    Genre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Overview = table.Column<string>(type: "TEXT", nullable: true),
                    PosterUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Rating = table.Column<double>(type: "REAL", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaItems", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MediaItems",
                columns: new[] { "Id", "CreatedAt", "Creator", "Genre", "Overview", "PosterUrl", "Rating", "ReleaseYear", "Status", "Title", "Type", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Christopher Nolan", "Sci-Fi, Action", "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.", null, 8.8000000000000007, 2010, "Completed", "Inception", "Movie", null },
                    { 2, new DateTime(2026, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Vince Gilligan", "Crime, Drama", "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.", null, 9.5, 2008, "Completed", "Breaking Bad", "TVShow", null },
                    { 3, new DateTime(2026, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Frank Herbert", "Science Fiction", "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family.", null, 9.0, 1965, "In Progress", "Dune", "Book", null },
                    { 4, new DateTime(2026, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "Pink Floyd", "Progressive Rock", "The eighth studio album by English rock band Pink Floyd, exploring themes of conflict, greed, time, and mental illness.", null, 9.3000000000000007, 1973, "Completed", "The Dark Side of the Moon", "Album", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MediaItems");
        }
    }
}
