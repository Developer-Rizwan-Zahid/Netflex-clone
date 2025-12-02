using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddHLSPlaylistToContents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WatchHistory_ProfileId",
                table: "WatchHistory");

            migrationBuilder.DropIndex(
                name: "IX_Favorites_UserId",
                table: "Favorites");

            migrationBuilder.AddColumn<string>(
                name: "HLSPlaylist",
                table: "Contents",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Contents",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Contents",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_WatchHistory_ProfileId_ContentId",
                table: "WatchHistory",
                columns: new[] { "ProfileId", "ContentId" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_UserId_ContentId",
                table: "Favorites",
                columns: new[] { "UserId", "ContentId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WatchHistory_ProfileId_ContentId",
                table: "WatchHistory");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Favorites_UserId_ContentId",
                table: "Favorites");

            migrationBuilder.DropColumn(
                name: "HLSPlaylist",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Contents");

            migrationBuilder.CreateIndex(
                name: "IX_WatchHistory_ProfileId",
                table: "WatchHistory",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_UserId",
                table: "Favorites",
                column: "UserId");
        }
    }
}
